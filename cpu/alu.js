//  ALU commands


// returns a boolean value
function alu_cond(func, A) {

  var result = (A == A );
  switch(func) {
    case "000100":  // beq 
    	result = (A == 0);
       	break;

    case "000111":  // bgtz  
    	result = (A > 0);
       	break;

    case "000110":  // blez  
    	result = (A <= 0);
        break;

    case "000101":  // bne  
    	result = (A != 0);
       	break;
  }

  return result? "1":"0";
}



function alu_compute(func, A, B) {
  	
  left  = parseInt(A, 2);
  right = parseInt(B, 2);

  // I'm not worring about overflow, etc.
  switch (func) {
    case "100000":  // add     
    case "100001":  // addu    
    case "001000":  // addi    
    case "001001":  // addiu  
    	result = left + right;
    	break

    case "100010":  // sub     
    case "100011":  // subu    
    	result = left - right;
    	break

    case "100110":  // xor     
    case "001110":  // xori 
    	result = left ^ right;   
    	break;

    case "100100":  // and     
    case "001100":  // andi  
    	result = left & right;
    	break;

    case "100111":  // nor     
    case "100101":  // or      
    case "001101":  // ori
    	result = left | right;

    case "000000":  // sll     
    case "000100":  // sllv    
    	result = left << right;
    	break;

    case "000011":  // sra     
    case "000111":  // srav   
    	result = left >> right;
    	break;

    case "000010":  // srl     
    case "000110":  // srlv 
    	result = left >>> right;   
    	break;

    case "101010":  // slt     
    case "101001":  // sltu    
    case "001010":  // slti    
    case "001001":  // sltiu 
    	result = ( left < right );
    	break;

    default:
    	error;
    	break;
   }

   //var ALUoutput BinaryValue(result);
   //if ALUoutput is > 32, then we have an overlow

   return result.toString(2).padStart(32, "0");
}
