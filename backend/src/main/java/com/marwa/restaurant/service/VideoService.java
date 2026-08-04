package com.marwa.restaurant.service;

import com.marwa.restaurant.dto.VideoDto;
import com.marwa.restaurant.entity.Video;
import com.marwa.restaurant.entity.VideoLike;
import com.marwa.restaurant.entity.VideoView;
import com.marwa.restaurant.entity.VideoShare;
import com.marwa.restaurant.repository.VideoRepository;
import com.marwa.restaurant.repository.VideoLikeRepository;
import com.marwa.restaurant.repository.VideoViewRepository;
import com.marwa.restaurant.repository.VideoShareRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * خدمة الفيديوهات (Video Service).
 * تدير العمليات الخاصة بالفيديوهات مع نظام حقيقي للإعجابات والمشاهدات والمشاركات.
 *
 * الميزات:
 * - منع تكرار الإعجاب من نفس المستخدم (toggle like/unlike)
 * - حساب المشاهدات مع throttle (منع التكرار خلال 30 ثانية)
 * - حماية النظام من التلاعب
 * - تحسين أداء الاستعلامات (aggregate counts)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VideoService {

    private static final Logger log = LoggerFactory.getLogger(VideoService.class);

    /** مدة منع تكرار المشاهدة بالثواني (30 ثانية) */
    private static final int VIEW_THROTTLE_SECONDS = 30;

    private final VideoRepository videoRepository;
    private final VideoLikeRepository videoLikeRepository;
    private final VideoViewRepository videoViewRepository;
    private final VideoShareRepository videoShareRepository;
    private final CloudStorageService cloudStorageService;

    /**
     * جلب جميع الفيديوهات مرتبة تنازلياً كـ DTOs مع الإحصائيات الحقيقية.
     */
    public List<VideoDto> getAllVideos() {
        return videoRepository.findAllByOrderByIdDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * نشر فيديو جديد.
     */
    @Transactional
    public VideoDto addVideo(VideoDto dto) {
        Video video = Video.builder()
                .title(dto.getTitle())
                .videoUrl(dto.getVideoUrl() != null ? dto.getVideoUrl().trim() : null)
                .description(dto.getDescription())
                .likes(0)
                .views(0)
                .shares(0)
                .build();
        Video saved = videoRepository.save(video);
        return convertToDto(saved);
    }

    /**
     * حذف فيديو بالمعرف.
     */
    @Transactional
    public void deleteVideo(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("الفيديو غير موجود بالمعرف: " + id));

        // حذف الملف من Cloudinary قبل حذفه من قاعدة البيانات
        cloudStorageService.deleteFile(video.getVideoUrl());

        videoRepository.deleteById(id);
    }

    /**
     * تبديل حالة الإعجاب (Like/Unlike) — نظام حقيقي يمنع التكرار.
     *
     * @param videoId        معرف الفيديو
     * @param userIdentifier معرف المستخدم (session ID / fingerprint)
     * @return DTO محدث مع حالة الإعجاب الجديدة
     */
    @Transactional
    public VideoDto toggleLike(Long videoId, String userIdentifier) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("الفيديو غير موجود بالمعرف: " + videoId));

        boolean alreadyLiked = videoLikeRepository.existsByVideoIdAndUserIdentifier(videoId, userIdentifier);

        if (alreadyLiked) {
            // إلغاء الإعجاب
            videoLikeRepository.deleteByVideoIdAndUserIdentifier(videoId, userIdentifier);
            video.setLikes(Math.max(0, (int) videoLikeRepository.countByVideoId(videoId)));
            log.info("تم إلغاء إعجاب الفيديو {} بواسطة {}", videoId, userIdentifier);
        } else {
            // تسجيل إعجاب جديد
            VideoLike like = VideoLike.builder()
                    .videoId(videoId)
                    .userIdentifier(userIdentifier)
                    .build();
            videoLikeRepository.save(like);
            video.setLikes((int) videoLikeRepository.countByVideoId(videoId));
            log.info("تم تسجيل إعجاب جديد للفيديو {} بواسطة {}", videoId, userIdentifier);
        }

        Video saved = videoRepository.save(video);
        VideoDto dto = convertToDto(saved);
        dto.setUserLiked(!alreadyLiked);
        return dto;
    }

    /**
     * تسجيل مشاهدة فيديو مع حماية throttle (30 ثانية).
     *
     * @param videoId        معرف الفيديو
     * @param userIdentifier معرف المستخدم
     * @param ipAddress      عنوان IP
     * @return DTO محدث
     */
    @Transactional
    public VideoDto registerView(Long videoId, String userIdentifier, String ipAddress) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("الفيديو غير موجود بالمعرف: " + videoId));

        // منع تكرار المشاهدة خلال فترة قصيرة
        LocalDateTime throttleTime = LocalDateTime.now().minusSeconds(VIEW_THROTTLE_SECONDS);
        boolean recentView = videoViewRepository.existsByVideoIdAndUserIdentifierAndCreatedAtAfter(
                videoId, userIdentifier, throttleTime
        );

        if (!recentView) {
            VideoView view = VideoView.builder()
                    .videoId(videoId)
                    .userIdentifier(userIdentifier)
                    .ipAddress(ipAddress)
                    .build();
            videoViewRepository.save(view);
            video.setViews((int) videoViewRepository.countByVideoId(videoId));
            videoRepository.save(video);
        }

        return convertToDto(video);
    }

    /**
     * تسجيل مشاركة فيديو.
     *
     * @param videoId        معرف الفيديو
     * @param userIdentifier معرف المستخدم
     * @param platform       المنصة (whatsapp, clipboard, etc.)
     * @return DTO محدث
     */
    @Transactional
    public VideoDto registerShare(Long videoId, String userIdentifier, String platform) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("الفيديو غير موجود بالمعرف: " + videoId));

        VideoShare share = VideoShare.builder()
                .videoId(videoId)
                .userIdentifier(userIdentifier)
                .platform(platform)
                .build();
        videoShareRepository.save(share);
        video.setShares((int) videoShareRepository.countByVideoId(videoId));
        videoRepository.save(video);

        return convertToDto(video);
    }

    /**
     * جلب حالة إعجاب المستخدم بفيديو محدد.
     */
    public boolean isLikedByUser(Long videoId, String userIdentifier) {
        return videoLikeRepository.existsByVideoIdAndUserIdentifier(videoId, userIdentifier);
    }

    /**
     * تحويل الكيان إلى DTO مع الإحصائيات الحقيقية.
     */
    private VideoDto convertToDto(Video video) {
        return VideoDto.builder()
                .id(video.getId())
                .title(video.getTitle())
                .videoUrl(video.getVideoUrl())
                .description(video.getDescription())
                .likes(video.getLikes() != null ? video.getLikes() : 0)
                .views(video.getViews() != null ? video.getViews() : 0)
                .shares(video.getShares() != null ? video.getShares() : 0)
                .createdAt(video.getCreatedAt())
                .build();
    }
}
