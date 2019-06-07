function simpleTemplating(data) {
var html = "";
$.each(data, function(index, value){
    html += '<article><a href="#" class="image"><img src="https://drive.google.com/uc?export=view&amp;id=' + value.gsx$url.$t + '" alt="" /></a>';
    html +='<h3>' + value.gsx$title.$t + '</h3>';
    html +='<p>' + value.gsx$firstname.$t + ' ' + value.gsx$lastname.$t + '</p>'
    html += value.gsx$text.$t;
    html += '<ul class="actions"><li><a href="response.html?post=' + value.gsx$postid.$t + '" class="button">More</a></li></ul></article>'
});
return html;
};

var sheetUrl = 'https://spreadsheets.google.com/feeds/list/1Sc3yb2leeOFNCFGgMOB9aec0-GdDkmI7iuZob0pVzYk/2/public/values?alt=json'

// Invoke the ajax request first
var xhr = new XMLHttpRequest()
xhr.open('GET', sheetUrl)
xhr.onload = function () {       

  var entries = JSON.parse(xhr.responseText);
  entries = entries.feed.entry;
  console.log(entries);

  var assignments = [];
    for (var i=0; i<entries.length; i++) {
        if ( assignments.includes(entries[i].gsx$assignment.$t)) {
        } else {
            assignments.push(entries[i].gsx$assignment.$t)
            }
    };
  
  // Once data has been loaded, then setup your paginataion instance and load 
  // the entries into the paginataion plugin
  $('#pagination-container').pagination({
      dataSource: entries,
      pageSize: 6,
      direction: 1,
      ulClassName: "pagination",
      callback: function(data, pagination) {
          var html = simpleTemplating(data);
          $('#data-container').html(html);
      }
  })
}

xhr.send()