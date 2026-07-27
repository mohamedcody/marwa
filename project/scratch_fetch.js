const fs = require('fs');

fetch('http://localhost:8080/api/videos')
  .then(res => res.json())
  .then(data => {
    fs.writeFileSync('scratch_videos_out.json', JSON.stringify(data, null, 2));
    console.log('Done, wrote output to scratch_videos_out.json');
  })
  .catch(err => {
    fs.writeFileSync('scratch_videos_out.json', JSON.stringify({ error: err.message }, null, 2));
    console.error('Error:', err);
  });
