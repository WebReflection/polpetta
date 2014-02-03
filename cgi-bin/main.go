//usr/bin/env go run $0 $@ ; exit
package main

import "fmt"
import "os"

func main() {
    fmt.Print("Content-type:text/html\r\n\r\n")
    fmt.Print("<html>")
    fmt.Print("<head>")
    fmt.Print("<title>Polpetta support for proper CGI</title>")
    fmt.Print("</head>")
    fmt.Print("<body>") 
    fmt.Print("<h2>Hello Word! This is my first CGI program</h2>")

    fmt.Print("<div>")
    fmt.Print(os.Getenv("QUERY_STRING"))
    fmt.Print("</div>")
    fmt.Print("<a href='?foo=bar&baz=bak'>try with some parameters</a>")
    fmt.Print("</body>")
    fmt.Print("</html>") 
}
