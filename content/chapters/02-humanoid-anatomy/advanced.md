# Humanoid Anatomy

The mechanical design of a humanoid robot represents a complex system of trade-offs between payload capacity, backdrivability, thermal efficiency, and mass distribution. Modern humanoid platforms — including Figure 01, Agility Robotics' Digit, and Tesla Optimus — reflect distinct engineering philosophies rooted in different actuator technologies and kinematic assumptions.

## Kinematic Architecture

A humanoid robot's kinematic chain is a tree-structured graph of rigid bodies connected by joints. The configuration space (C-space) of a fully articulated humanoid with n revolute joints is an n-dimensional manifold. Full-body humanoids typically feature 30–50 degrees of freedom (DOF), distributed as:

- **Lower body:** 6 DOF per leg (hip: 3, knee: 1, ankle: 2) → 12 DOF total
- **Torso:** 1–2 DOF (pitch/yaw for load shifting)
- **Upper body:** 7 DOF per arm (shoulder: 3, elbow: 1, wrist: 3) → 14 DOF total
- **Hands:** 6–21 DOF per hand depending on dexterity requirements
- **Head/neck:** 2–3 DOF for gaze control

Forward kinematics maps joint angles θ ∈ ℝⁿ to end-effector pose via the product of homogeneous transformation matrices. Inverse kinematics (IK) — computing θ given a desired end-effector pose — is generally underdetermined for redundant manipulators and is solved numerically using damped least-squares (Levenberg-Marquardt) or analytical methods for specific sub-chains.

## Actuator Technologies

**Quasi-Direct-Drive (QDD) motors** have become the dominant actuator paradigm for research humanoids. By using high-torque, low-gear-ratio motors (gear ratio ≤ 10:1), QDD actuators achieve high backdrivability and torque transparency — critical for contact-rich tasks and safe human interaction. The trade-off is reduced peak torque relative to high-gear-ratio systems.

**Series Elastic Actuators (SEAs)** interpose a compliant spring between the motor and the load. This provides:
- Passive impact absorption
- Accurate torque sensing (via spring deflection measurement)
- Mechanical energy storage

The spring introduces a second-order dynamic lag that complicates high-bandwidth control but improves stability margins in contact.

**Hydraulic actuators** (used in Boston Dynamics Atlas) deliver superior power-to-weight ratios (~2–5 kW/kg vs ~0.5–1 kW/kg for electric) but require hydraulic pumps, accumulators, and fluid management systems that add complexity and weight.

## Structural Materials

Modern humanoid frames use a combination of:
- **6061/7075 aluminum alloy** for primary structural members — high stiffness-to-weight ratio
- **Carbon fiber reinforced polymer (CFRP)** for limb links where torsional stiffness matters
- **Selective laser sintering (SLS) nylon** for complex geometry brackets and covers

Mass distribution is critical for locomotion efficiency. The target is to minimize distal limb mass (shank, foot) to reduce the moment of inertia of the swinging leg, thereby lowering the energy cost of gait.

## Power Systems

Humanoid robots are powered by lithium polymer (LiPo) or lithium iron phosphate (LiFePO4) battery packs, typically in the 48V–72V range to minimize resistive losses in motor drive cables. Energy capacity ranges from 1–3 kWh depending on platform size.

Peak power demand during dynamic maneuvers (jumping, rapid arm swings) can reach 2–5 kW, requiring battery management systems (BMS) with high C-rate discharge capability and supercapacitor buffers in some designs.

Thermal management is a significant constraint: motor windings and power electronics must be kept below 80–120°C. Passive heatsinking suffices for low-power platforms; high-performance systems require liquid cooling loops.

## Key References

- Raibert et al. (2008). *BigDog, the rough-terrain quadruped robot.* IFAC Proceedings.
- Pratt & Williamson (1995). *Series elastic actuators.* IROS 1995.
- Seok et al. (2015). *Design principles for energy-efficient legged locomotion.* IEEE/ASME Transactions on Mechatronics.
