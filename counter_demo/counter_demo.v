module counter_demo (
	input wire clk,
	input wire reset,
	input wire enable,
	input wire direction,
	output reg[3:0] count
);

always @(posedge clk) begin
	if (reset)
		count <= 4'b0000;
	else if (enable) begin
		if (direction)
			count <= count + 1'b1;
		else
			count <= count - 1'b1;
		end
end

endmodule