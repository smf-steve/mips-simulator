// A set of general support routines


function zeroExtend(binary_sequence, length=wordSize) {
    return binary_sequence.padStart(length, "0")
}

function signedExtend(binary_sequence, length=WordSize) {
    return (binary_sequence[0] == "0")
       ? binary_sequence.padStart(length, "0")
       : binary_sequence.padStart(length, "1")
}
