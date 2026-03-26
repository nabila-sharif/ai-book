# Locomotion and Control

Moving through the world is deceptively hard. Humans learn to walk over years of practice, developing a finely tuned sense of balance that operates below conscious awareness. Teaching a robot to do the same has been one of the central challenges of robotics for decades. Today, thanks to advances in control theory and machine learning, humanoid robots can walk, jog, climb stairs, and even recover from pushes with impressive robustness.

## Movement Basics

Walking is a continuous process of controlled falling. With each step, the robot shifts its weight forward and catches itself with the next foot. The key insight from biomechanics is that stable walking requires the **center of mass** to remain within a region called the **support polygon** — the convex hull of the contact points with the ground.

When only one foot is on the ground (single support phase), the support polygon is just the area of that foot. The robot must keep its center of mass projected over this small area while swinging the other leg forward. This requires precise coordination of every joint in the body.

**Gaits** are structured patterns of foot placement and timing. Common gaits include:
- **Walk** — always at least one foot on the ground; most stable, lowest speed
- **Trot** — diagonal pairs of limbs move together; faster but requires better balance
- **Run** — both feet briefly off the ground simultaneously; highest speed, most demanding

Modern humanoid robots primarily use walking gaits. Running remains an active research challenge for full-size humanoids, though it has been demonstrated in carefully controlled conditions.

## Balance and Stability

Balance control operates on multiple timescales simultaneously.

**Static stability** — the robot maintains balance while standing still — is achieved by keeping the center of mass over the support polygon. This is straightforward for a stationary robot but must be maintained throughout every motion.

**Dynamic stability** — maintaining balance during movement — is far more challenging. A walking robot is never statically stable; it relies on momentum and careful timing to stay upright. The key theoretical tool is the **Zero Moment Point (ZMP)**: the point on the ground where the net ground reaction force acts. If the ZMP stays within the support polygon, the robot won't tip over. Walking controllers plan trajectories that keep the ZMP safely inside this boundary.

**Push recovery** is the ability to remain standing after an unexpected perturbation. This requires detecting the disturbance quickly (via IMU and foot force sensors) and generating compensatory movements — a step in the right direction, a shift of the arms, a bending of the knees — within milliseconds. Modern learned controllers have dramatically improved push recovery compared to hand-coded methods.

## Planning Motion

Generating a full motion plan for a humanoid involves multiple layers working together.

**Task planning** operates at the highest level: decide what sequence of actions achieves the goal. "Pick up the box and place it on the shelf" decomposes into: walk to the box, grasp the box, carry the box, place the box.

**Motion planning** generates collision-free trajectories for the robot's body through space. For arm movements, this often uses **inverse kinematics (IK)**: given a desired end-effector position (the hand position), compute the joint angles required to reach it. IK has closed-form solutions for simple arms; for complex humanoid arms it is typically solved numerically.

For whole-body motion — tasks that require coordinating all limbs simultaneously — **Model Predictive Control (MPC)** has become a dominant approach. MPC solves a constrained optimization problem at each timestep: given the current state and a desired future trajectory, compute the sequence of joint torques that best achieves the goal while respecting physical constraints (joint limits, contact forces, balance). MPC runs at 100–500Hz on modern hardware.

**Footstep planning** decides where to place each foot, typically several steps ahead. This is essential for navigating non-flat environments — stairs, rubble, stepping stones. The planner must check that each candidate footstep lands on a valid surface and that the resulting path maintains balance throughout.

The integration of learned locomotion policies — neural networks trained in simulation and transferred to real hardware — has been transformative. These policies can discover gaits and recovery behaviors that are difficult to engineer by hand, and they generalize to terrain and perturbations they were never explicitly programmed to handle. The combination of classical control theory and learned policies represents the current state of the art in humanoid locomotion.
