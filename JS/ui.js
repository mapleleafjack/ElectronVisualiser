$('#song').change(function() {
  console.log('set ' + document.getElementById("song").files[0].path);
    $('#audiofile').attr("src", document.getElementById("song").files[0].path);
});
