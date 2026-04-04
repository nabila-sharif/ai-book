# Introduction to Physical AI

Physical AI represents the convergence of machine learning, real-time control theory, and robotic hardware into systems capable of closed-loop interaction with unstructured environments. Unlike narrow AI systems operating in bounded digital domains, Physical AI must contend with partial observability, stochastic dynamics, and the fundamental challenge of sim-to-real transfer.

## Defining Physical AI

A Physical AI system is formally characterized by four properties:

1. **Embodiment** — the system has a physical instantiation with actuators and proprioceptive/exteroceptive sensors
2. **Real-time constraint satisfaction** — control loops must close within strict latency budgets (typically 1–10 ms for low-level motor control)
3. **Uncertainty tolerance** — the system must perform robustly under observation noise, model mismatch, and environmental perturbation
4. **Adaptive behavior** — the system generalizes beyond its training distribution through learned representations

The distinction from classical robotics is architectural: classical systems use hand-crafted state machines and explicit kinematic models; Physical AI systems learn latent world models from data and use those models for planning and policy execution.

## The Convergence That Made This Possible

Three simultaneous advances unlocked Physical AI between 2018 and 2024:

**Computational substrate.** The GPU revolution that enabled large-scale language model training equally enabled deep reinforcement learning at scale. Training a humanoid locomotion policy in MuJoCo now requires approximately 10^9 simulation steps — feasible on a single GPU cluster in hours.

**High-fidelity simulation.** Physics engines including MuJoCo (DeepMind), Isaac Gym (NVIDIA), and Genesis achieve contact dynamics accurate enough to transfer learned policies to hardware with minimal fine-tuning. Domain randomization over friction coefficients, mass distributions, and actuator delays provides the stochasticity needed for robust transfer.

**Actuator and sensor maturity.** Series elastic actuators (SEAs) and quasi-direct-drive (QDD) motors provide torque transparency and back-drivability essential for safe human interaction. IMU sensor fusion (typically EKF or UKF over accelerometer + gyroscope + magnetometer) provides reliable state estimation at costs measured in dollars rather than thousands.

## Architectural Patterns

Modern Physical AI systems generally follow one of two architectural patterns:

**Hierarchical (two-level):** A high-level policy (often a transformer or diffusion model) generates task-level plans; a low-level controller (often a learned or analytical PD controller) executes them at kilohertz rates. This separation of timescales matches the biological motor control hierarchy.

**End-to-end:** A single neural network maps raw sensor observations directly to motor torques or joint positions. This approach, demonstrated in systems like RT-2 and ACT, achieves strong generalization at the cost of interpretability and sample efficiency.

## Open Problems

Despite rapid progress, Physical AI faces several unsolved challenges:

- **Contact-rich manipulation** — dexterous hand control under partial observation remains an open research problem
- **Long-horizon planning** — current systems struggle with tasks requiring more than ~20 sequential decisions
- **Energy efficiency** — biological locomotion achieves ~0.2 cost of transport; current humanoids typically achieve ~2–5x worse
- **Safety guarantees** — formal verification of learned policies under distribution shift is an active research area

## Key References

- Hwangbo et al. (2019). *Learning agile and dynamic motor skills for legged robots.* Science Robotics.
- Brohan et al. (2023). *RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control.* arXiv:2307.15818.
- Peng et al. (2020). *Learning to Walk in Minutes Using Massively Parallel Deep RL.* CoRL 2020.
