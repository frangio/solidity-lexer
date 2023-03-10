export const assembly = /(?<whitespace>\s+)|(?<string>"(?:[^\\"\n\r]*|\\[^])*")|(?<comment>\/\/.*|\/\*[^]*?\*\/)|(?<delim>(?<ldelim>[({])|(?<rdelim>[)]))|(?<symbol>,)|(?<eof>$)/;
export const normal = /(?<whitespace>\s+)|(?:(?<keyword>abstract|address|after|alias|anonymous|apply|assembly|as|auto|bool|break|byte|calldata|case|catch|constant|constructor|continue|contract|copyof|days|default|define|delete|do|else|emit|enum|error|ether|event|external|fallback|false|final|for|from|function|gwei|hex(?!["'])|hours|if|immutable|implements|import|indexed|inline|interface|internal|in|is|leave|let|library|macro|mapping|match|memory|mutable|minutes|modifier|new|null|of|override|partial|payable|pragma|private|promise|public|pure|receive|reference|relocatable|return|returns|revert|sealed|seconds|sizeof|static|storage|string|struct|supports|switch|this|throw|true|try|typedef|typeof|type|unchecked|using|var|view|virtual|weeks|wei|while|years|bytes(?:32|31|30|29|28|27|26|25|24|23|22|21|20|19|18|17|16|15|14|13|12|11|10|9|8|7|6|5|4|3|2|1)?|u?int(?:256|248|240|232|224|216|208|200|192|184|176|168|160|152|144|136|128|120|112|104|96|88|80|72|64|56|48|40|32|24|16|8)?|u?fixed(?:[1-9][0-9]*x[1-9][0-9]*)?)|(?<hexnumber>0x[0-9a-fA-F]+(?:_[0-9a-fA-F]+)*)|(?<number>(?:(?:[0-9]+(?:_[0-9]+)*)?\.)?[0-9]+(?:_[0-9]+)*(?:[eE]-?[0-9]+(?:_[0-9]+)*)?))(?![a-zA-Z0-9$_])|(?<string>'(?:[^\\'\n\r]*|\\[^])*'|"(?:[^\\"\n\r]*|\\[^])*")|(?<hexstring>hex(?:'(?:(?:[0-9a-fA-F]{2})+(?:_(?:[0-9a-fA-F]{2})+)*)?'|"(?:(?:[0-9a-fA-F]{2})+(?:_(?:[0-9a-fA-F]{2})+)*)?"))|(?<ident>[a-zA-Z$_][a-zA-Z0-9$_]*)|(?<comment>\/\/(?<sdcomment>\/)?.*|\/\*(?<mdcomment>\*(?!\/))?[^]*?\*\/)|(?<delim>(?<ldelim>[{(\[])|(?<rdelim>[})\]]))|(?<symbol>[:.,?~]|(?:[\^\/%!]|<{1,2}|>{1,3})=?|=[=>]?|-[=>\-]?|&[&=]?|\*[*=]?|\|[|=]?|\+[+=]?)|(?<semicolon>;)|(?<eof>$)/;
export const pragma = /(?<whitespace>\s+)|(?<string>'(?:[^\\'\n\r]*|\\[^])*'|"(?:[^\\"\n\r]*|\\[^])*")|(?<hexstring>hex(?:'(?:(?:[0-9a-fA-F]{2})+(?:_(?:[0-9a-fA-F]{2})+)*)?'|"(?:(?:[0-9a-fA-F]{2})+(?:_(?:[0-9a-fA-F]{2})+)*)?"))|(?<pragmatoken>(?:[^;\s\/'"]|\/(?![\/*]))+)|(?<comment>\/\/.*|\/\*[^]*?\*\/)|(?<semicolon>;)|(?<eof>$)/;
export const yul = /(?<whitespace>\s+)|(?:(?<keyword>break|case|continue|default|false|for|function|if|leave|let|switch|true|hex(?!["']))|(?<yulbuiltin>stop|add|sub|mul|div|sdiv|mod|smod|exp|not|lt|gt|slt|sgt|eq|iszero|and|or|xor|byte|shl|shr|sar|addmod|mulmod|signextend|keccak256|pop|mload|mstore|mstore8|sload|sstore|msize|gas|address|balance|selfbalance|caller|callvalue|calldataload|calldatasize|calldatacopy|extcodesize|extcodecopy|returndatasize|returndatacopy|extcodehash|create|create2|call|callcode|delegatecall|staticcall|return|revert|selfdestruct|invalid|log0|log1|log2|log3|log4|chainid|origin|gasprice|blockhash|coinbase|timestamp|number|difficulty|prevrandao|gaslimit|basefee)|(?<hexnumber>0x[0-9a-fA-F]+)|(?<number>0|[1-9][0-9]*))(?![a-zA-Z0-9$_])|(?<string>'(?:[^\\'\n\r]*|\\[^])*'|"(?:[^\\"\n\r]*|\\[^])*")|(?<hexstring>hex(?:'(?:(?:[0-9a-fA-F]{2})+(?:_(?:[0-9a-fA-F]{2})+)*)?'|"(?:(?:[0-9a-fA-F]{2})+(?:_(?:[0-9a-fA-F]{2})+)*)?"))|(?<ident>[a-zA-Z$_][a-zA-Z0-9$_]*)|(?<comment>\/\/.*|\/\*[^]*?\*\/)|(?<delim>(?<ldelim>[({])|(?<rdelim>[)}]))|(?<symbol>:(?![=])|:=|->|[.,])|(?<eof>$)/;
