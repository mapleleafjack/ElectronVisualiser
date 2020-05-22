var songload = document.getElementById('song');

songload.onchange = function() {
  var audiofile = document.getElementById('audiofile');
  audiofile.src = songload.files[0].path;
}
