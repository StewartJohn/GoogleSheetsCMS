function simpleTemplating(data) {
var html = "";
$.each(data, function(index, value){
    html += '<article><a href="response.html?post=' + value.gsx$postid.$t + '" class="image"><img src="https://drive.google.com/uc?export=view&amp;id=' + value.gsx$url.$t + '" alt="" /></a>';
    html +='<h3>' + value.gsx$title.$t + '</h3>';
    html +='<p><a href="?student=' + value.gsx$lastname.$t + value.gsx$firstname.$t + '">' + value.gsx$firstname.$t + ' ' + value.gsx$lastname.$t + '</a></p>';
    html += value.gsx$excerpt.$t;
    html += '<ul class="actions"><li><a href="response.html?post=' + value.gsx$postid.$t + '" class="button">More</a></li></ul></article>'
});
return html;
};

//get the sheetID from the yaml in the project's root directory
var ymlconfig;
var sheetID;
read_config('../../../sheets.yaml'); // calling function
console.log(ymlconfig["sheetID"][0]); // is empty

setTimeout(function() { // let's wait 2000 ms. hope it's enough to send the request and receive and read the response
   sheetID = ymlconfig["sheetID"][0];
   console.log(ymlconfig["sheetID"][0]); // TADA! It's read.
   console.log(sheetID);
}, 2000);

function read_config(cfgfile) {
   $.get({url: cfgfile, dataType: "text"})
    .done(function (data) {
       ymlconfig = jsyaml.load(data);
   });
};

//pass the sheetID to the var sheetUrl
//var sheetUrl = 'https://spreadsheets.google.com/feeds/list/' + sheetID + '/1/public/values?alt=json';
var sheetUrl = 'https://spreadsheets.google.com/feeds/list/1exPWWgKN9Bkg7zKG1vIf0OXgDtjEQHdbOXqfwmpzMa8/1/public/values?alt=json';

// Invoke the ajax request from the sheetID
var xhr = new XMLHttpRequest()
xhr.open('GET', sheetUrl)
xhr.onload = function () {

var entries = JSON.parse(xhr.responseText);
entries = entries.feed.entry;

//Create a list of the assignments from the entries
var assignments = [];
    for (var i=0; i<entries.length; i++) {
        if ( assignments.includes(entries[i].gsx$assignmenttext.$t)) {
        } else {
            assignments.push(entries[i].gsx$assignmenttext.$t)
            }
    }
    console.log(assignments);

//Add the assignments to the menu
var cList = $('ul.myMenu')
$.each(assignments, function(i)
{
    var j = i + 1;
    var li = $('<li/>')
        .appendTo(cList);
    var aaa = $('<a/>')
        .attr("href", "?assignment=" + j)
        .text(assignments[i])
        .appendTo(li);
});

//Reverse the entries order to put most recent posts first in the display
entries = entries.reverse();

//Check for a search parameter filtering for a desired student or assignment & return the entries for just that student or assignment
var url_string = window.location.href;
var url = new URL(url_string);
var assignmentRequest = url.searchParams.get("assignment");
if(assignmentRequest !== null){
    var newEntries = entries.filter(function (el) {
        return el.gsx$assignment.$t == assignmentRequest;
    })
    entries = newEntries;
}
var studentRequest = url.searchParams.get("student");
if(studentRequest !== null){
    var newEntries = entries.filter(function (el) {
        var lastNameCheck = el.gsx$lastname.$t + el.gsx$firstname.$t
        return lastNameCheck == studentRequest;
    })
    entries = newEntries;
}


  // Once data has been loaded, then setup your paginataion instance and load
  // the entries into the paginataion plugin
  $('#pagination-container').pagination({
      dataSource: entries,
      pageSize: 6,
      direction: -1,
      ulClassName: "pagination",
      callback: function(data, pagination) {
          var html = simpleTemplating(data);
          $('#data-container').html(html);
      }
  })
}

xhr.send()
