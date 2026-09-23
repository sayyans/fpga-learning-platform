module memory_datapath_demo (
   input wire clk,
   input wire reset,
   input wire write_enable,
   input wire add_enable,
   input wire [1:0] address,
   input wire [7:0] data_in,

   output reg [7:0] data_out,
   output reg [7:0] accumulator
);

   // Four 8-bit memory locations
   reg [7:0] memory [0:3];

   // Synchronous memory write
   always @(posedge clk) begin
      if (write_enable)
         memory[address] <= data_in;
   end

   // Memory read
   always @(*) begin
      data_out = memory[address];
   end

   // Accumulator datapath
   always @(posedge clk) begin
      if (reset)
         accumulator <= 8'b00000000;
      else if (add_enable)
         accumulator <= accumulator + data_out;
   end

endmodule