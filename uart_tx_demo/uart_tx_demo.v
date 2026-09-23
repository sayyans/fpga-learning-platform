module uart_tx_demo (
   input wire clk,
   input wire reset,
   input wire start,
   input wire [7:0] data_in,  //8bit data we are sending

   output reg tx,
   output reg busy
);

   // 100 MHz clock / 115200 baud ≈ 868 clock cycles per UART bit
   localparam CLKS_PER_BIT = 868;

   // UART transmitter states
   localparam IDLE_STATE  = 2'b00;
   localparam START_STATE = 2'b01;
   localparam DATA_STATE  = 2'b10;
   localparam STOP_STATE  = 2'b11;

   // Internal registers
   reg [7:0] data_reg;
   reg [2:0] bit_index;
   reg [9:0] baud_counter;
   reg [1:0] current_state;

   always @(posedge clk) begin
      if (reset) begin
         current_state <= IDLE_STATE;
         data_reg <= 8'b00000000;
         bit_index <= 3'b000;
         baud_counter <= 10'b0000000000;
         tx <= 1'b1;
         busy <= 1'b0;
      end
      else begin
         case (current_state)

            IDLE_STATE: begin
               tx <= 1'b1;
               busy <= 1'b0;
               baud_counter <= 10'b0000000000;
               bit_index <= 3'b000;

               if (start) begin
                  data_reg <= data_in;
                  current_state <= START_STATE;
                  busy <= 1'b1;
               end
            end

            START_STATE: begin
               tx <= 1'b0;
               busy <= 1'b1;

               if (baud_counter == CLKS_PER_BIT - 1) begin
                  baud_counter <= 10'b0000000000;
                  current_state <= DATA_STATE;
               end
               else begin
                  baud_counter <= baud_counter + 1'b1;
               end
            end

            DATA_STATE: begin
               tx <= data_reg[bit_index];
               busy <= 1'b1;

               if (baud_counter == CLKS_PER_BIT - 1) begin
                  baud_counter <= 10'b0000000000;

                  if (bit_index == 3'b111) begin
                     bit_index <= 3'b000;
                     current_state <= STOP_STATE;
                  end
                  else begin
                     bit_index <= bit_index + 1'b1;
                  end
               end
               else begin
                  baud_counter <= baud_counter + 1'b1;
               end
            end

            STOP_STATE: begin
               tx <= 1'b1;
               busy <= 1'b1;

               if (baud_counter == CLKS_PER_BIT - 1) begin
                  baud_counter <= 10'b0000000000;
                  current_state <= IDLE_STATE;
                  busy <= 1'b0;
               end
               else begin
                  baud_counter <= baud_counter + 1'b1;
               end
            end

            default: begin
               current_state <= IDLE_STATE;
               data_reg <= 8'b00000000;
               bit_index <= 3'b000;
               baud_counter <= 10'b0000000000;
               tx <= 1'b1;
               busy <= 1'b0;
            end

         endcase
      end
   end

endmodule