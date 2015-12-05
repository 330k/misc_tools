/**
 *  Zero-Width Unicode Character Steganography
 *  Copyright (c) 2015 Kei Misawa
 *  This software is released under the MIT License.
 *  http://opensource.org/licenses/mit-license.php
 */
(function(){
    var chars = ['\u200b', '\u200c', '\u200d', '\u202c'];
    var radix = chars.length;
    var codelength = Math.ceil(Math.log2(65536) / Math.log2(radix));
    /**
      Encoder
      args: original text, hidden text
      return: unicode text with steganography
     */
    window.encode_steganography = function(text1, text2){
        var encode_to_zerowidth_characters = (function(str1){
            var result = [];
            var base = '0'.repeat(codelength);
            
            for(var i = 0; i < str1.length; i++){
                var c = str1.charCodeAt(i);
                var d = c.toString(radix);
                
                result[i] = (base + d).substr(-codelength);
            }
            
            var r = result.join('');
            
            for(var i = 0; i < radix; i++){
                r = r.replace(new RegExp(i, 'g'), chars[i]);
            }
            
            return r;
        });
        var combine_shuffle_string = (function(str1, str2){
            var result = [];
            var c1 = str1.split(/./g);
            var c2 = str2.split(new RegExp('.{' + codelength + '}', 'g'));
            var ratio = c1.length / (c1.length + c2.length);
            
            while((c1.length > 0) && (c2.length > 0)){
                if(Math.random() <= ratio){
                    result.push(c1.shift());
                }else{
                    result.push(c2.shift());
                }
            }
            result = result.concat(c1).concat(c2);
            
            return result.join('');
        });
        return combine_shuffle_string(text1, encode_to_zerowidth_characters(text2));
    };
    
    /**
      Decoder
      args: unicode text with steganography
      return: array of [original text, hidden text]
     */
    window.decode_steganography = function(text1){
        var split_zerowidth_characters = (function(str1){
        	var result = [];
        	result[0] = str1.replace(new RegExp('[' + chars.join('') + ']', 'g'), '');
        	result[1] = str1.replace(new RegExp('[^' + chars.join('') + ']', 'g'), '');
        	
        	return result;
        });
        var decode_from_zero_width_characters = (function(str1){
            var r = str1;
            for(var i = 0; i < radix; i++){
                r = r.replace(new RegExp(chars[i], 'g'), i);
            }
            var result = [];
            for(var i = 0; i < r.length; i += codelength){
                result.push(String.fromCodePoint(Number.parseInt(r.substr(i, codelength), radix)));
            }
            
            return result.join('');
        });
        
        var result = split_zerowidth_characters(text1);
        result[1] = decode_from_zero_width_characters(result[1]);
        return result;
    };
    
    return null;
})();
