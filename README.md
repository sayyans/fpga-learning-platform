\# FPGA Lab — Interactive Digital Logic Learning Platform



An interactive learning platform for exploring digital logic, FPGA design, RTL development, and timing analysis through guided lessons, visualizations, experiments, coding challenges, and quizzes.



FPGA Lab grew out of one of the subjects I found most challenging during my Computer Engineering studies. Although I had access to hands-on labs and FPGA development tools through my coursework, I often found myself focused on completing the required lab steps rather than feeling confident enough to experiment with the designs and understand how changing individual pieces affected the hardware.



Ironically, it took finishing my degree for me to decide that the best way to revisit one of my most challenging subjects was to voluntarily build an entire project around it.



I built FPGA Lab both to strengthen my own understanding and to create the kind of learning environment I would have found helpful as a student: a place where you are encouraged to change things, observe what happens, visualize the underlying hardware, and practice difficult concepts in a more approachable and engaging way.



\## Overview



FPGA Lab combines an interactive React learning environment with Verilog designs developed using Intel Quartus Prime.



The platform follows a guided learning structure:



\*\*Learn → Visualize → Experiment → Code → Quiz\*\*



Each module introduces a digital-design concept, provides an interactive representation of its behavior, and connects the concept back to RTL and FPGA implementation.



\## Learning Modules



The platform currently contains eight modules:



1\. \*\*Logic \& Multiplexers\*\* — combinational logic and signal selection

2\. \*\*Registers\*\* — clocked storage and sequential logic

3\. \*\*Counters\*\* — state updates, enable behavior, and wraparound

4\. \*\*Finite State Machines\*\* — states, transitions, and control logic

5\. \*\*UART\*\* — digital communication, baud timing, and transmission control

6\. \*\*Memory \& Datapaths\*\* — storage, data movement, and datapath operations

7\. \*\*Synthesis \& RTL\*\* — translating HDL into FPGA hardware structures

8\. \*\*Timing Analysis\*\* — clock constraints, setup timing, and slack



\## Features



\* Guided step-by-step digital logic lessons

\* Interactive hardware visualizations

\* Adjustable experiments and controls

\* Verilog coding challenges

\* Knowledge-check quizzes

\* Persistent module completion tracking

\* RTL design examples

\* Quartus project files and timing constraints

\* RTL Viewer references for implemented FPGA designs

\* Responsive dark-mode interface



\## FPGA Designs



The repository includes several standalone Quartus/Verilog projects used alongside the learning platform:



\* Register

\* Counter

\* Finite State Machine

\* UART Transmitter

\* Memory and Datapath



The FPGA projects include source RTL, Quartus project files, timing constraints where applicable, and RTL Viewer references.



\## Technology Stack



\### Web Platform



\* React

\* TypeScript

\* Vite

\* HTML/CSS

\* Browser localStorage for learning progress



\### FPGA / Digital Design



\* Verilog

\* Intel Quartus Prime Lite

\* RTL synthesis and visualization

\* Synopsys Design Constraints (SDC)

\* Static timing analysis concepts



\## Project Structure



```text

fpga-learning-platform/

├── counter\_demo/

├── fsm\_demo/

├── memory\_datapath\_demo/

├── register\_demo/

├── uart\_tx\_demo/

└── web-app/

```



The `web-app` directory contains the interactive React application, while the remaining directories contain the associated FPGA/RTL projects.



\## Running the Web Application



Clone the repository and navigate to the web application:



```bash

cd web-app

npm install

npm run dev

```



Then open the local address displayed by Vite in your browser.



\## Timing Analysis



Several designs were constrained using a 10 ns clock period, corresponding to a 100 MHz timing requirement.



The learning platform includes both interactive conceptual timing demonstrations and results from the Quartus timing workflow. Conceptual browser demonstrations are clearly separated from actual FPGA tool results.



\## Why I Built This



Digital logic and FPGA design were among the most challenging areas of my Computer Engineering degree. I had the opportunity to work with these concepts through coursework and hands-on labs, but I often approached the labs by trying to get the required design working rather than confidently experimenting with it.



I realized that what I had been missing was the freedom to play around with the concepts: change an input, modify a piece of logic, visualize the resulting hardware, intentionally break something, and understand \*why\* the behavior changed.



That experience became the motivation behind FPGA Lab.



I wanted to revisit a subject I had struggled with and learn it differently by building the kind of environment I would have benefited from at the time. At the same time, I wanted to create something that could eventually help other engineering students facing the same learning curve.



The goal is not to replace university labs or professional FPGA tools. Instead, FPGA Lab is intended to complement them by giving students a lower-pressure environment to build intuition, experiment with concepts, and become more comfortable before tackling more complex hardware designs.



\## Future Development



FPGA Lab is currently an early version of a larger project I plan to continue developing in my free time.



The current eight-module platform establishes the foundation, but I would like to gradually expand it into a more comprehensive digital-design learning environment with deeper exercises, additional hardware concepts, and more advanced FPGA workflows.



Future directions may include:



\* Additional FPGA and digital-design modules

\* More advanced RTL exercises and coding challenges

\* HDL compilation and simulation integration

\* Waveform-based learning tools

\* Expanded static timing analysis exercises

\* Additional communication protocols

\* FPGA development-board demonstrations

\* More complex datapath and processor-design concepts



My long-term goal is to continue growing the project as my own hardware-design knowledge develops, while making it increasingly useful to students learning the same concepts.



\## Author



\*\*Sude Sayyan\*\*

Bachelor of Engineering — Computer Engineering (Co-op)

McMaster University



