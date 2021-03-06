var sanitizeHTML = require('sanitize-html');
module.exports =  {
    html : function(title,list,body, control){
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <a href="/author">author</a>
        ${list}
        ${control}
        ${body}
      </body>
      </html>
      `;
    },
    list: function (topics) {
      var list =  '<ul>';
      var i = 0;
      while (topics.length > i) {
        list = list + `<li><a href="/topic/${topics[i].id}">${sanitizeHTML(topics[i].title)}</a></li>`;
        i = i + 1;
      }
      list = list + '</ul>';
      return list;
    },
    authorSelect:function(authors, author_id) {
      let tag = '';
      for (let i=0; i<authors.length; i++){
        let selected = '';
        if (authors[i].id === author_id){
          selected = 'selected';
        }
        tag += `<option value="${authors[i].id}" ${selected}>${sanitizeHTML(authors[i].name)}</option>`;
      }
      return `
      <select name="author">
      ${tag}
      </select>
      `;
    },
    authorTable:function(author){
      let tag = '<table>';
            for (let i=0; i< author.length; i++){
                tag += `
                    <tr>
                        <td>${sanitizeHTML(author[i].name)}</td>
                        <td>${sanitizeHTML(author[i].profile)}</td>
                        <td><a href="/author/update/${author[i].id}">수정</a></td>
                        <td>
                          <form action="/author/delete" method="post">
                            <input type="hidden" name="id" value="${author[i].id}">
                            <input type="submit" value="delete">
                          </form>
                        </td>
                    </tr>
                `;
            }
      tag += '</table>';
      return tag;
    }
  }