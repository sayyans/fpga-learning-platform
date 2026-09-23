module fsm_demo (
	input wire clk,
   input wire reset,
   input wire timer_done,

   output reg red,
   output reg yellow,
   output reg green
);

   // State encoding
   localparam GREEN_STATE   = 2'b00;
   localparam YELLOW_STATE  = 2'b01;
   localparam ALL_RED_STATE = 2'b10;
   localparam RED_STATE     = 2'b11;

   reg [1:0] current_state;
   reg [1:0] next_state;

   // State register
   always @(posedge clk) begin
      if (reset)
         current_state <= GREEN_STATE;
      else
         current_state <= next_state;
   end

   // Next-state logic
   always @(*) begin
      next_state = current_state;

      case (current_state)
         GREEN_STATE: begin
            if (timer_done)
               next_state = YELLOW_STATE;
         end

         YELLOW_STATE: begin
            if (timer_done)
               next_state = ALL_RED_STATE;
         end

         ALL_RED_STATE: begin
            if (timer_done)
               next_state = RED_STATE;
         end

         RED_STATE: begin
            if (timer_done)
               next_state = GREEN_STATE;
         end

         default: begin
            next_state = GREEN_STATE;
         end
      endcase
   end

   // Output logic
   always @(*) begin
      red = 1'b0;
      yellow = 1'b0;
      green = 1'b0;

      case (current_state)
         GREEN_STATE:
            green = 1'b1;

         YELLOW_STATE:
            yellow = 1'b1;

         ALL_RED_STATE:
            red = 1'b1;

         RED_STATE:
            red = 1'b1;

         default: begin
            red = 1'b0;
            yellow = 1'b0;
            green = 1'b0;
         end
      endcase
   end

endmodule