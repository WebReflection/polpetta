#!/usr/bin/env ruby


puts "Content-type:text/html\r\n\r\n";
puts '<html>';
puts '<head>';
puts '<title>Polpetta support for proper CGI</title>';
puts '</head>';
puts '<body>'; 
puts '<h2>Hello Word! This is my first CGI program</h2>';

puts '<div>';
puts ENV['QUERY_STRING'];
puts '</div>';
puts '<a href="?foo=bar&baz=bak">try with some parameters</a>';
puts '</body>';
puts '</html>'; 
