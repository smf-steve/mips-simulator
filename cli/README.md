# Command-line Interface:

# Purpose:
This directory contains the code necessary to call the simumlator via the command-line.

The general purpose of this is to execute the code for effect.

# Features:
  1. Execution Counts
     - provide summary informatin (with and without Nops) at the end of execution
     - provide a limit to the number of instructions executed
  1. provide simple monitor of a subroutine
     - start execution count, keep track of # of insturctions
     - dump memory pre and post

  1. dump the contents of registers: post execution
  1. dump the contents of memory: pre and post execution
     1. set the output display: in ascii, hex, etc
     1. set a range for the output

  1. help
  1. set entry point
  1. provide a library location (Include)
     - Mars has a project directovy

  1. Provide input arguements

# example

asim [filename] "entry==arg0" arg1, arg2, agr3

   filename: equivalient to the dockerfile 
      default can be in the current directory


