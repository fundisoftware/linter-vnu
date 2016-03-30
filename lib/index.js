'use babel'

function checkDocument(editor) {
  
  var contentType
  var xmlContentType = "application/xhtml+xml"
  var htmlContentType = "text/html; charset=utf-8"
  var parserConfigSetting = atom.config.get("linter-vnu.parser")
  var fetchHeaders = new Headers()
  var vnuUrl = atom.config.get("linter-vnu.vnuUrl")
  var editorPath =  editor.getPath()
  
  var vnuMessageErrors = '<span class="linter-highlight status-error icon icon-x">There were errors.</span>'
  var vnuMessageValid = '<span class="linter-highlight status-success icon icon-check">' +
    'The document validates according to the specified schema(s).</span>'

  if (editorPath.endsWith(".xhtml") || editorPath.endsWith(".xht")) {
    contentType = xmlContentType
  } else {
    contentType = htmlContentType
  }
  
  fetchHeaders.append("Content-Type", contentType)

  var fetchInit = {
    method: "POST",
    headers: fetchHeaders,
    body: editor.getText(),
    mode: "cors",
  }
  
  var fetchUrl = vnuUrl + (vnuUrl.endsWith("/") ? "" : "/") + "?out=json"
  
  var fetchRequest = new Request(fetchUrl, fetchInit)

  return fetch(fetchRequest).then(function(response) {
    if(response.ok) {
      return response.json()
    } else {
      console.log('Network response was not ok.')
    }
  })
  .then(function(responseJson) {
    var vnuMessages = responseJson.messages
    var editorPath =  editor.getPath()
    // Assume document is valid
    var documentIsValid = true
    // Converts v.Nu message array to Linter message array
    var convertVnuMessagesToLinter = function(vnuMessage) {
      // If there are any errors, then document is not valid
      if (vnuMessage.type === "error") {
        documentIsValid = false
      }
      // Create an empty Linter message object
      var linterMessage = {}
      // Set the message type
      linterMessage.type = vnuMessage.type
      // Set the message severity based on type
      switch (vnuMessage.type) {
        case "non-document-error":
          linterMessage.severity = "error"
          break
        default:
          linterMessage.severity = vnuMessage.type
      }
      // Append any message subtype to the type
      if (typeof vnuMessage.subtype !== "undefined") {
        linterMessage.type += ": " + vnuMessage.subtype
      }
      linterMessage.text = vnuMessage.message
      // If v.Nu message contains a range,
      // then map it to the Linter message
      if (typeof vnuMessage.lastLine !== "undefined") {  
        // First line and column default to same as last
        if (typeof vnuMessage.firstLine === "undefined") {
          vnuMessage.firstLine = vnuMessage.lastLine
        }
        if (typeof vnuMessage.firstColumn === "undefined") {
          vnuMessage.firstColumn = vnuMessage.lastColumn
        }
        // v.Nu line and column numbers are one-based,
        // Linter numbers are zero-based
        linterMessage.range = [
          [--vnuMessage.firstLine, --vnuMessage.firstColumn],
          [--vnuMessage.lastLine, --vnuMessage.lastColumn]
        ]
      }
      linterMessage.filePath = editorPath
      return linterMessage
    }
    // Append individual messages to summary message
    var linterMessages = vnuMessages.map(convertVnuMessagesToLinter)
    var linterSummaryMessage = [
      {
        type: "summary",
        severity: (documentIsValid ? "info" : "error"),
        html: (documentIsValid ? vnuMessageValid : vnuMessageErrors),
        filePath: editorPath
      }
    ]
    return linterSummaryMessage.concat(linterMessages)
  })
  .catch(function(error) {
    return Promise.resolve([{
      type: "error",
      severity: "error",
      html: 'No response from v.Nu at <a href="' + vnuUrl + '">' + vnuUrl + '</a>',
      filePath: editor.getPath()
    }])
    //console.log('There has been a problem with your fetch operation: ' + error.message)
  })
}

export function provideLinter() {
  return {
    name: "v.Nu",
    grammarScopes: ["text.html.basic"],
    scope: "file",
    lintOnFly: atom.config.get("linter-vnu.lintOnFly"),
    lint: function(editor) {
      return Promise.resolve(checkDocument(editor))
    }
  }
}
