

// Latches:
//   Latches are named for the segments in which they provide input
//   A supporting variable is used to allow each segment to be evaluated
//   and then all of the latches are simultaneously  updated
//   PC is provided in each latch, for descriptive purposes

// var multdiv_i_regisgers = { hi: "", lo: ""};
// ctl values= ""
// R: register-register
// R: mult-div:  
//    // Need to defer the loading of these values
// I: register-immediate
// I: load
// I: store
// I: branch
// J: jump
// 
// J_type = { type: "J", op: "00 0000", address: "00 0000 0000 0000 0000 0000 0000"};
// R_type = { type: "R", op: "00 0000", rs: "00000", rt: "00000", rd: "00000", shv: "00000", func: "000000" };
// I_type = { type: "I", op: "00 0000", rs: "00000", rt: "00000", imm: "0000 0000 0000 0000"};


// Issues:
//   1. how does the use of the MULT-DIV get integrated
//   1. J type instruction does not sim to be handled
// put everything as a binaryValue, and use conversions routines
// How do we map to the type
// Decode section needs to set the following things:
//   jump, branch, memRead, MemtoReg ALUOp, MemWerit ALUSrc, REGwrit

// Diagram does not handle Jump

//stubs:

var memory = [
    0x2610fffe, // addiu   $s0, $s0, -2; 
    0x714b4802, // mult    $t1, $t2, $t3;   
    1, 2, 3, 4, 5, 6, 7, 8, 9];

function memory_read(index) {
    return memory[index];
}

function register_read(index) {
  return 0x32;
}

var pipelined       = false;
var fetch_latch     = {pc: 0x00 };
var decode_latch    = {pc: 0x00, ir: 0x00, npc: 0x00};
var execute_latch   = {pc: 0x00, ctl: 0x00, ir: 0x00, imm: 0x00, A: 0x00, B: 0x00, npc: 0x00};
var memory_latch    = {pc: 0x00, ctl: 0x00, B: 0x00, alu: 0x00, cond: 0x00, npc: 0x00};
var writeback_latch = {pc: 0x00, ctl: 0x00, lmd: 0x00, alu: 0x00, npc: 0x00};
var fetch_latch_in;
var decode_latch_in;
var execute_latch_in;
var memory_latch_in;
var writeback_latch_in;


function cpu_cycle () {

  /////////////////////////// L A T C H  I N ///////////////////////////////////
  if (! pipelined) {
     fetch_latch = fetch_latch_in;
  }
  /////////////////////////////////////////////////////////////////////////////
  //////////////////////////// F E T C H //////////////////////////////////////
  {
    decode_latch_in.ir  = memory_read(fetch_latch[fetch_latch.pc]); 
      // IR  <- Mem[PC]
    decode_latch_in.npc = fetch_latch.pc + 4;                      
      // NPC <- PC + 4  
  }


  /////////////////////////// L A T C H  I N //////////////////////////////////
  if (! pipeline) {
     decode_latch = decode_latch_in;
  }
  /////////////////////////////////////////////////////////////////////////////
  ////////////////////////// D E C O D E //////////////////////////////////////
  {
    // Values within the decode_latch
    // pc: for descriptive purposes
    // ir.type = "J", ir.op, ir.address
    // ir.type = "R", ir.op, ir.rs, ir.rt, ir.rd, ir.shv, ir.func
    // ir.type = "I", ir.op, ir.rs, ir.rt, ir.imm  
    // npc       //    NPC =  IR[0..4] |  IR.address<< 4  my note.

    //    A   <- Regs[IR(6..10)]
    //    B   <- Regs[IR(11..15)]
    //    Imm <- sign extended IR(16..31)

    execute_latch_in.ir = execute_latch.ir;
    execute_latch_in.op = decode_latch.ir.substring(1,5);
    execute_latch_in.A = register_read(decode_latch.ir.substring(6,10));
    execute_latch_in.B = register_read(decode_latch.ir.substring(11,15));
    execute_latch_in.immediate = signedExted(decode_latch.ir.substring(16,31);

    //decoding -> will determine the following sequence based on instruction
    execute_latch_in.ctl = 


  }


  /////////////////////////// L A T C H  I N //////////////////////////////////
  if (! pipelined) {
    execute_latch = execute_latch_in;
  }
  /////////////////////////////////////////////////////////////////////////////
  ///////////////////////// E X E C U T E /////////////////////////////////////
  {
    // Values within the execute_latch
    // pc: for descriptive purposes
    // ir.type = "J", ir.op, ir.address
    // ir.type = "R", ir.op, ir.rs, ir.rt, ir.rd, ir.shv, ir.func
    // ir.type = "I", ir.op, ir.rs, ir.rt, ir.imm  
    // immediate:
    // B: 
    // A: 
    // npc:

    // By now the mult-div unit is done
    // copy the values the last operation was done, how do I do that?
    //registers.hi = multdiv_i_registers.hi;
    //registers.lo = multdiv_i_rgisters.lo;

    switch (execute_latch.ctl) {

      case "load":    // lw  ALUoutput, Imm(A);  AMux=A-0, BMux=Imm-1
      case "store":   // sw  ALUoutput, Imm(A);  AMux=A-0, BMux=Imm-1
      // ALUoutput <- A + Imm
        memory_latch_in.alu = alu_compute("100000", execute_latch.A,execute_latch.immediate);
        break;

      case "register-register":  // op ALUoutput, A, B; AMux=A-0, BMux=B-0
        // ALUoutput <- A op B
        memory_latch_in.alu = alu_compute(op, execute_latch.A, execute_latch.B);
        break;

    case "register-immediate": // op ALUoutput, A, Imm; AMux=A-0, BMux=Imm-1
      // ALUoutput <- A op Imm
      memory_latch_in.alu = alu_compute(op, execute_latch.A, execute_latch.immediate);
      break;

    case "branch":           // bxx A, B, Imm; AMux=NPC-1, BMux=Imm-1
                 // jal $A

      // ALUoutput <- NPC + Imm  // ((label-(current+4))>>2)
      // Cond <- A op 0
      memory_latch_in.alu = alu_compute("100000", execute_latch.npc, execute_latch.immediate);
      memory_latch_in.cond = alu_cond(op, execute_latch.A);
      break;


        // perhaps this is register-register
    case "muldiv":
        // ALUoutput <- multdiv.lo || mult.high
        // {high, low} = A (/ * ) B
      break;
  }
  }


  /////////////////////////// L A T C H  I N //////////////////////////////////
  if (! pipelined) {
     memory_latch = memory_latch_in;
  }
  /////////////////////////////////////////////////////////////////////////////
  ////////////////////////// M E M O R Y //////////////////////////////////////
  {
  case: "load"
    // LMD <- Mem[ALUoutput]
    writeback_latch_in.lmd = memory_read(memory_latch.ALUoutput);
    break;

  case: "store"
    // Mem[ALUoutput] <- B
    memory_write(memory_latch.ALUoutput, memory_latch.B)
    break;

  case "register-register":
  case "register-immediate":
    break;

  case: "branch"
    if(memory_latch.cond) {
      // PC <- ALUoutput
      writeback_latch_in.pc = memory_latch.ALUoutput;
    } else {
      // PC <- NPC
        writeback_latch_in.pc = memory_latch.npc;
    }
    break;
  }

  /////////////////////////// L A T C H  I N ///////////////////////////////////
  if (! pipelined) {
     writeback_latch = writeback_latch_in;
  }
  /////////////////////////////////////////////////////////////////////////////
  //////////////////////// W R I T E B A C K //////////////////////////////////
  {

  switch (ctl) {
    case "load":
      // Regs[IR(11..15)] <- LMD
      register_write(writeback_latch.rt, writeback_latch.LMD);
      break;

    case "store":
      break;

    case "register-register":
      // Regs[IR(16..20)] <- ALUoutput
      register_write(writeback_latch.rd, writeback_latch.ALUoutput);
      break;

    case "register-immediate":
      // Regs[IR(11..15)] <- ALUoutput
      register_write(writeback_latch.rt, writeback_latch.ALUoutput);
      break;

    case "branch":
      break;
  }
  }
  /////////////////////////////////////////////////////////////////////////////


  /////////////////////////// L A T C H  I N //////////////////////////////////
  if (pipelined) {
    // Now activate the clock to "latch" in the new values

    // test for harzards to insert slots
    ///  op h-rd, rt, rs
    //   lX h-rt, (rs)
    //       op rd, h-rt, rs  // need to wait for h-rd to be put into the register
    //       op rd, rt, h-rs  // need to wait for h-rd to be put into the register
    //       op rt, (h-rs)    // need to wait for h-rd to be put into the register
    // output-- harzard
    ///  decode_latch_in.rt == write-back_latch.rt  then stall or somethiung lik that
    fetch_latch     = fetch_latch_in;
    decode_latch    = decode_latch_in;
    execute_latch   = execute_latch_in;
    memory_latch    = memory_latch_in;
    writeback_latch = writeback_latch_in;
  }
  /////////////////////////////////////////////////////////////////////////////

  
}