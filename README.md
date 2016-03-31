# The v.Nu linter (`linter-vnu`)

A [linter](https://en.wikipedia.org/wiki/Lint_%28software%29) for the [Atom](https://atom.io/) editor that uses the [Nu Html Checker](http://validator.github.io/validator/) (v.Nu) to validate HTML5 or XHTML5 documents as you type ("on the fly") or when you save.

![Preview](https://github.com/fundisoftware/linter-vnu/blob/master/images/linter-vnu-demo.gif?raw=true)

## Don't other Atom linters already do this?

No. The v.Nu linter is the first Atom linter to use v.Nu.

Neither `linter-htmllint` nor `linter-xmllint` do what `linter-vnu` does.

If you want to use `xmllint` to validate (X)HTML, you might be interested in the [unsoup/validator](https://github.com/unsoup/validator) GitHub repo.

## Why v.Nu?

- [Provenance](https://github.com/validator/validator/issues/251#issuecomment-192209209)
- [Currency](https://github.com/validator/validator/graphs/commit-activity)
- [Open source](https://github.com/validator/validator)

## How it works

1. The v.Nu linter uses an Ajax request to send the current Atom document to v.Nu.
2. v.Nu returns validation messages in JSON format.
3. The v.Nu linter converts the messages into the JSON required by the Atom Linter.
4. The Atom Linter displays the messages.

The v.Nu linter is a client of the v.Nu web service and a linter provider for the [Atom Linter](https://atom.io/packages/linter). The v.Nu linter is just glue code. The real work is done by v.Nu and Linter.

## Requirements

- Atom editor
- Atom Linter package (`linter`)
- HTTP(S) URL of an instance of v.Nu

The URL might be a localhost URL, referring to an instance of v.Nu installed on your computer.

### Reasons to install v.Nu

You do not need to install v.Nu on your computer to use the v.Nu linter. You just need a v.Nu URL.

However, there are reasons to install v.Nu on your computer. For similar reasons, you might choose to install v.Nu on a computer that you share with other users on an intranet.

#### Performance

The v.Nu linter communicates with v.Nu via HTTP(S). Installing v.Nu on your computer means you can specify a localhost URL for v.Nu, such as `http://localhost:8888`, bypassing network interface hardware.

You can configure the v.Nu linter to lint either as you type ("on the fly") or only when you save. By default, the v.Nu linter lints on the fly: it sends the current document to v.Nu *every 0.3 seconds* while you are typing. You can set this interval in the Linter package settings. If you routinely stream high-definition video across your network, this traffic might not be an issue. Otherwise, it's worth considering.

Linter triggers its providers only _while you are typing_. To see what this means in practice - in terms of frequency of Ajax requests from the v.Nu linter to v.Nu - use the Atom developer tools to monitor network activity.

If you choose not to lint as you type - to lint only when you save - then performance is less of an issue.

#### Security

A localhost URL means your data stays on your computer.

#### Courtesy

Is it cool (polite) to post every 0.3 seconds to a public v.Nu that you don't pay for?
See the [`validator.nu` terms of service](https://about.validator.nu/#tos).

## Installation

1. Install the Atom editor.
2. Install the Atom Linter package. <br>
 For example: in Atom, select File &#x25b6; Settings &#x25b6; Install, and then select `linter`.
3. Install this package (`linter-vnu`).
4. Decide whether to install v.Nu on your computer or to use an existing v.Nu instance.

 To help you decide, see "Reasons..." (above).

 To install v.Nu on your computer, continue to the next step. Otherwise, skip to step 10.
5. If you do not have Java on your computer, [install it](https://java.com/en/download/).

 v.Nu is a Java application. It requires a Java runtime.

 For more details on v.Nu installation requirements, such as the minimum Java version required, see the [v.Nu documentation](http://validator.github.io/validator/#standalone).

 To check your Java version, enter `java -version` at a command prompt.
5. Download the [latest v.Nu release](https://github.com/validator/validator/releases/latest) `vnu.jar_`...`.zip` file.
6. Extract the contents of the `.zip` file.
7. Open a command prompt in the directory containing the extracted `vnu.jar` file.
8. Enter the following `java` command to start v.Nu as a standalone web server:
 ```shell
 java -Xss512k -cp vnu.jar nu.validator.servlet.Main 8888
 ```
 - `-Xss512k` sets the thread stack size. You might not need this parameter. But if you omit it, you might get a stack overflow error.
 - `8888` is the port number on which v.Nu listens. Feel free to specify a different port.

 For more information on installing v.Nu, see the [v.Nu documentation](http://validator.github.io/validator/#standalone).
9. Confirm that v.Nu is running: open the URL (for example, [`http://localhost:8888`](http://localhost:8888)) in a browser.
10. If you are not using the default URL `http://localhost:8888`, point the v.Nu linter at the correct URL: in Atom, select File &#x25b6; Settings &#x25b6; Packages, select `linter-vnu`, and then enter the URL.

## Usage

To validate the current document as **HTML5**, give it the file extension `.html` or one of the other file extensions that belong to the HTML grammar.

To validate the current document as **XHTML5** (the XML serialization of HTML5), the document must have the file extension `.xhtml`.

The `examples` directory of this package contains files to play with.

## To do

Perhaps. Given time. If there's interest from users.

- Add a "v.Nu start command" setting. If the v.Nu URL is a `localhost` URL, and that URL is not responding to requests, then issue the start command.

- If possible, exploit the `schema` ("bring your own schema") parameter of the v.Nu web service to validate languages other than HTML5 and XHTML5. (Including, but not limited to, languages such as SVG and MathML that v.Nu already validates inline in (X)HTML.) That would open up a universe of validation possibilities.

- Raise with the Atom developers the idea of defining XHTML as a grammar that is distinct from HTML.

- Move and expand some topics from this readme to a wiki.

## Terminology

"The v.Nu linter" is an abbreviation for "An Atom linter provider for v.Nu, developed by Graham Hannington at Fundi Software".

"v.Nu linter" is, arguably, both a tautology and a lie. v.Nu might be characterized as a linter (cue the punditry on *linter* versus *validator* versus *document conformance checker* :smile:), but the v.Nu linter is not v.Nu. And the v.Nu linter is not, by itself, a linter.

The use of a leading definite article - *the* v.Nu linter - is also questionable. See the [disclaimer](#disclaimer).

## Reporting issues

To report issues with messages from v.Nu, please [contact the v.Nu developers](http://validator.github.io/validator/site/nu-about.html#issues).

To report issues with the v.Nu linter, includings *how* the v.Nu linter presents messages from v.Nu, [create an issue for the `linter-vnu` repo](https://github.com/fundisoftware/linter-vnu).

## Disclaimer

The developer of the v.Nu linter is sincerely grateful to, but is not affiliated with, the developers of v.Nu.

## Acknowledgments

Thanks to the developers of v.Nu, Atom, and Atom Linter. Your hard work made developing the v.Nu linter easy.
