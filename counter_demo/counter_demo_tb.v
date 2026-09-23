`timescale 1ns/1ps

module counter_demo_tb;
	
	reg clk;
	reg reset;
	reg enable;
	reg direction;
	
	wire [3:0] count;
	
	// Connect the testbench to our actual counter
	counter_demo uut (
		.clk(clk),
		.reset(reset),
		.enable(enable),
		.direction(direction),
		.count(count)
	);

	// 10 ns clock period = 100 MHz
	always #5 clk = ~clk;
	
	initial begin
	
		// Starting values
		clk = 0;
		reset = 1;
		enable = 0;
		direction = 1;
		
		// Reset the counter
		#20;
		reset = 0;
		
		// Count UP
		enable = 1;
		direction = 1;
		#80;
		
		// Hold the current value
		enable = 0;
		#40;
		
		// Count DOWN
		enable = 1;
		direction = 0;
		#80;

		// Reset again
		reset = 1;
		#20;
		reset = 0;
		
		#20;
		$stop;
		
	end

endmodule