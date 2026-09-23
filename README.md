# FPGA Lab — Interactive Digital Logic Learning Platform

An interactive learning platform for exploring digital logic, FPGA design, RTL development, and timing analysis through guided lessons, visualizations, experiments, coding challenges, and quizzes.

FPGA Lab grew out of one of the subjects I found most challenging during my Computer Engineering studies. Although I had access to hands-on labs and FPGA development tools through my coursework, I often found myself focused on completing the required lab steps rather than feeling confident enough to experiment with the designs and understand how changing individual pieces affected the hardware.

Ironically, it took finishing my degree for me to decide that the best way to revisit one of my most challenging subjects was to voluntarily build an entire project around it.

I built FPGA Lab both to strengthen my own understanding and to create the kind of learning environment I would have found helpful as a student: a place where you are encouraged to change things, observe what happens, visualize the underlying hardware, and practice difficult concepts in a more approachable and engaging way.

## Overview

FPGA Lab combines an interactive React learning environment with Verilog designs developed using Intel Quartus Prime.

The platform follows a guided learning structure:

**Learn → Visualize → Experiment → Code → Quiz**

Each module introduces a digital-design concept, provides an interactive representation of its behavior, and connects the concept back to RTL and FPGA implementation.

## Learning Modules

The platform currently contains eight modules:

1. **Logic & Multiplexers** — combinational logic and signal selection
2. **Registers** — clocked storage and sequential logic
3. **Counters** — state updates, enable behavior, and wraparound
4. **Finite State Machines** — states, transitions, and control logic
5. **UART** — digital communication, baud timing, and transmission control
6. **Memory & Datapaths** — storage, data movement, and datapath operations
7. **Synthesis & RTL** — translating HDL into FPGA hardware structures
8. **Timing Analysis** — clock constraints, setup timing, and slack

## Features

* Guided step-by-step digital logic lessons
* Interactive hardware visualizations
* Adjustable experiments and controls
* Verilog coding challenges
* Knowledge-check quizzes
* Persistent module completion tracking
* RTL design examples
* Quartus project files and timing constraints
* RTL Viewer references for implemented FPGA designs
* Responsive dark-mode interface

## FPGA Designs

The repository includes several standalone Quartus/Verilog projects used alongside the learning platform:

* Register
* Counter
* Finite State Machine
* UART Transmitter
* Memory and Datapath

The FPGA projects include source RTL, Quartus project files, timing constraints where applicable, and RTL Viewer references.

## Technology Stack

### Web Platform

* React
* TypeScript
* Vite
* HTML/CSS
* Browser localStorage for learning progress

### FPGA / Digital Design

* Verilog
* Intel Quartus Prime Lite
* RTL synthesis and visualization
* Synopsys Design Constraints (SDC)
* Static timing analysis concepts

## Project Structure

```text
fpga-learning-platform/
├── counter_demo/
├── fsm_demo/
├── memory_datapath_demo/
├── register_demo/
├── uart_tx_demo/
└── web-app/