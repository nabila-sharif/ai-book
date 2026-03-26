# Humanoid Anatomy

Humanoid robots are designed around the human body plan — two legs, two arms, a torso, and a head. This is not purely aesthetic. Humans have built a world shaped for human bodies: handles at hand height, stairs with human-sized steps, tools with grips sized for human hands. A robot that shares our form factor can operate in those spaces without redesigning everything around it.

## Body Structure

A humanoid robot's body is organized into a kinematic chain — a series of rigid segments connected by joints. Each segment (link) has mass, geometry, and inertial properties. Each joint connects two links and allows relative motion between them.

The typical humanoid has approximately 30 to 50 degrees of freedom (DoF) — each DoF represents an independent axis of motion. For comparison, the human body has over 200 joints, though many are constrained. A practical humanoid needs at least:

- **6 DoF per leg** (hip: 3, knee: 1, ankle: 2) = 12 total for bipedal walking
- **7 DoF per arm** (shoulder: 3, elbow: 1, wrist: 3) = 14 total for arm reach
- **3 DoF for the neck** (pan, tilt, roll)
- **1–2 DoF per hand finger** (simplified) or full 5-finger hands with 15+ DoF

More degrees of freedom mean more capable motion but also more complexity in control, more weight, and higher power consumption. Most current humanoids make deliberate trade-offs — simplifying the hands or waist to keep the overall system manageable.

## Joints and Actuators

Joints are driven by actuators — devices that convert electrical energy into mechanical motion. The choice of actuator fundamentally shapes a robot's behavior.

**Electric servo motors** are the most common actuator in modern humanoids. They offer precise position and velocity control and can be made small and light. The key metric is torque density: how much rotational force (torque) relative to weight. Modern motors used in robots like Tesla Optimus and Figure-01 achieve torque densities high enough to support a humanoid's full body weight.

**Series elastic actuators (SEA)** add a spring between the motor and the joint. This makes the joint compliant — it can absorb impacts without damaging the motor, and it can measure force by sensing spring deflection. Compliance is crucial for walking on uneven terrain and for safe interaction with humans.

**Hydraulic actuators** use pressurized fluid and can generate very high forces, useful for heavy-lifting robots. The tradeoff is weight (pumps and fluid lines), noise, and potential for leaks. Boston Dynamics' Atlas originally used hydraulics; newer versions have moved to electric actuation.

**Gear reduction** is almost always used between the motor shaft and the joint. A small, fast motor spinning at thousands of RPM is geared down to a slow, powerful joint rotation. The gear ratio determines the tradeoff between speed and torque.

## Power and Control

A humanoid robot needs two types of power: **electrical power** to run motors, sensors, and computers, and **computational power** to process sensor data and compute motor commands.

**Battery systems** in current humanoids typically use lithium-ion or lithium-polymer cells — the same chemistry as electric vehicles, but miniaturized. Power consumption is significant: a walking humanoid may draw 500W to 2kW depending on its activity. Battery life of 1–2 hours is typical for current-generation systems.

**Onboard computers** handle perception, planning, and low-level control. There are typically at least two layers:
- A **high-level computer** (often a GPU-equipped system-on-chip) for neural network inference, perception processing, and task planning
- A **real-time controller** (a dedicated microcontroller or FPGA) for low-latency joint control at 1kHz or higher

The real-time controller is critical. If the walking control loop runs even a few milliseconds late, the robot can fall. The high-level AI can be slower and more complex — it thinks in terms of tasks and movements. The low-level controller executes those movements with precise, millisecond-level timing.

**Communication between joints and computers** is handled by fieldbus systems like EtherCAT, which allow hundreds of motors and sensors to communicate reliably at millisecond rates over a single cable loop. This is borrowed from industrial robotics, where reliable real-time communication has been standard for decades.

Understanding this physical substrate — links, joints, actuators, power, and communication — is essential for understanding both what humanoid robots can do today and what engineering challenges remain before they become truly general-purpose machines.
