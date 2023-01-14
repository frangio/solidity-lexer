export const normal = /\s*(?:(?<keyword>abstract|address|after|anonymous|assembly|as|bool|break|byte|calldata|case|catch|constant|constructor|continue|contract|days|default|delete|do|else|emit|enum|error|ether|event|external|fallback|false|for|from|function|gwei|hours|if|immutable|import|indexed|interface|internal|is|leave|let|library|mapping|memory|minutes|modifier|new|override|payable|pragma|private|public|pure|receive|return|returns|revert|seconds|storage|string|struct|switch|this|throw|true|try|type|unchecked|using|var|view|virtual|weeks|wei|while|bytes(?:32|31|30|29|28|27|26|25|24|23|22|21|20|19|18|17|16|15|14|13|12|11|10|9|8|7|6|5|4|3|2|1)?|u?int(?:256|248|240|232|224|216|208|200|192|184|176|168|160|152|144|136|128|120|112|104|96|88|80|72|64|56|48|40|32|24|16|8)?)(?![a-zA-Z0-9$_])|(?<ident>[a-zA-Z$_][a-zA-Z0-9$_]*)|(?<number>(?:(?:[0-9](?:_[0-9])*)?\.)?[0-9](?:_[0-9])*(?:[eE]-?[0-9](?:_[0-9])*)?)|(?<string>'(?:[^\\']*|\\.)*'|"(?:[^\\"]*|\\.)*")|(?<comment>\/\/.*|\/\*[^]*?\*\/)|(?<delim>(?<ldelim>[{(\[])|(?<rdelim>[})\]]))|(?<symbol>[:.,?~]|(?:[^\/%!]|<{1,2}|>{1,3})=?|=[=>]?|-[=>\-]?|&[&=]?|\*[*=]?|\|[|=]?|\+[+=]?)|(?<semicolon>;)|(?<eof>$))/;
export const pragma = /\s*(?:(?<pragmatoken>(?:[^;\s\/]|\/(?![\/*]))+)|(?<comment>\/\/.*|\/\*[^]*?\*\/)|(?<semicolon>;)|(?<eof>$))/;
