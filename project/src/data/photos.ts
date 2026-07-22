export type Photo = {
  id: string;
  src: string;
  caption: string;
};

// Stock food/restaurant photos from Pexels
export const photos: Photo[] = [
  {
    id: 'p1',
    src: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'فول مدمس بالزيت الحار',
  },
  {
    id: 'p2',
    src: 'https://images.pexels.com/photos/8472992/pexels-photo-8472992.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'طعمية مصرية طازة',
  },
  {
    id: 'p3',
    src: 'https://images.pexels.com/photos/5409026/pexels-photo-5409026.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'عجة بيض بالبسطرمة',
  },
  {
    id: 'p4',
    src: 'https://images.pexels.com/photos/4194683/pexels-photo-4194683.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'فطار مصرية أصيلة',
  },
  {
    id: 'p5',
    src: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'سندوتش طعمية محشية',
  },
  {
    id: 'p6',
    src: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'أكل مصري بلدي',
  },
  {
    id: 'p7',
    src: 'https://images.pexels.com/photos/3219547/pexels-photo-3219547.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'جبنة بيضاء مع خبز',
  },
  {
    id: 'p8',
    src: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'شاي كركك بلدي',
  },
];
