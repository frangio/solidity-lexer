export const normal = /(?<whitespace>\s+)|(?<keyword>abstract|address|after|alias|anonymous|apply|assembly|as|auto|bool|break|byte|calldata|case|catch|constant|constructor|continue|contract|copyof|days|default|define|delete|do|else|emit|enum|error|ether|event|external|fallback|false|final|for|from|function|gwei|hex|hours|if|immutable|implements|import|indexed|inline|interface|internal|in|is|leave|let|library|macro|mapping|match|memory|mutable|minutes|modifier|new|null|of|override|partial|payable|pragma|private|promise|public|pure|receive|reference|relocatable|return|returns|revert|sealed|seconds|sizeof|static|storage|string|struct|supports|switch|this|throw|true|try|typedef|typeof|type|unchecked|using|var|view|virtual|weeks|wei|while|years|bytes(?:32|31|30|29|28|27|26|25|24|23|22|21|20|19|18|17|16|15|14|13|12|11|10|9|8|7|6|5|4|3|2|1)?|u?int(?:256|248|240|232|224|216|208|200|192|184|176|168|160|152|144|136|128|120|112|104|96|88|80|72|64|56|48|40|32|24|16|8)?|u?fixed(?:[1-9][0-9]*x[1-9][0-9]*)?)(?![a-zA-Z0-9$_])|(?<ident>[a-zA-Z$_][a-zA-Z0-9$_]*)|(?<number>(?:(?:[0-9](?:_[0-9])*)?\.)?[0-9](?:_[0-9])*(?:[eE]-?[0-9](?:_[0-9])*)?)|(?<string>'(?:[^\\'\n\r]*|\\[^])*'|"(?:[^\\"\n\r]*|\\[^])*")|(?<comment>\/\/.*|\/\*[^]*?\*\/)|(?<delim>(?<ldelim>[{(\[])|(?<rdelim>[})\]]))|(?<symbol>[:.,?~]|(?:[\^\/%!]|<{1,2}|>{1,3})=?|=[=>]?|-[=>\-]?|&[&=]?|\*[*=]?|\|[|=]?|\+[+=]?)|(?<semicolon>;)|(?<eof>$)/;
export const pragma = /(?<whitespace>\s+)|(?<pragmatoken>(?:[^;\s\/'"]|\/(?![\/*]))+)|(?<comment>\/\/.*|\/\*[^]*?\*\/)|(?<string>'(?:[^\\'\n\r]*|\\[^])*'|"(?:[^\\"\n\r]*|\\[^])*")|(?<semicolon>;)|(?<eof>$)/;
