# Locomotion and Control

Legged locomotion control is among the most technically demanding problems in robotics, requiring the integration of rigid body dynamics, contact mechanics, trajectory optimization, and real-time state estimation. The past decade has seen a paradigm shift from model-based analytical controllers to learned policies, with hybrid approaches currently achieving the best performance on hardware.

## Rigid Body Dynamics and Contact

The equations of motion for a floating-base system (robot not fixed to ground) are given by the Newton-Euler equations in generalized coordinates:

```
M(q)q̈ + C(q,q̇)q̇ + g(q) = τ + Jᵀλ
```

where M(q) is the mass matrix, C(q,q̇) captures Coriolis and centrifugal terms, g(q) is the gravity vector, τ is the joint torque vector, J is the contact Jacobian, and λ is the vector of contact forces (ground reaction forces).

Contact introduces complementarity constraints: a foot is either in contact (λ ≥ 0, no penetration) or in the air (λ = 0, foot free). These hybrid dynamics create a switched system with discrete contact events that complicate trajectory optimization.

## Stability Criteria

**Zero Moment Point (ZMP):** The point on the ground where the net moment of all ground reaction forces is zero. Static stability requires ZMP to lie within the support polygon (convex hull of contact points). ZMP-based controllers dominated humanoid locomotion until ~2015 but are inherently conservative, limiting dynamic behaviors.

**Divergent Component of Motion (DCM/eCMP):** Decomposes the center of mass (CoM) dynamics into stable and unstable components. The unstable component diverges exponentially if uncontrolled; footstep placement is planned to regulate it. This formulation enables more natural, energy-efficient gait than ZMP approaches.

**Whole-Body Control (WBC):** Formulates locomotion as a hierarchy of quadratic programs (QPs) that enforce contact constraints while tracking desired CoM and end-effector trajectories. WBC solves for joint torques directly, enabling simultaneous locomotion and manipulation.

## Model Predictive Control

Model Predictive Control (MPC) optimizes a sequence of control actions over a receding horizon T:

```
min Σᵢ [‖xᵢ - x*ᵢ‖²Q + ‖uᵢ‖²R]
s.t. xᵢ₊₁ = f(xᵢ, uᵢ), contact constraints, torque limits
```

Convex MPC approximates the full nonlinear dynamics with a linear model, enabling real-time solution at 100–500 Hz. MIT Cheetah and ANYmal demonstrated quadrupedal dynamic locomotion using convex MPC. Extension to humanoids requires handling more contact modes and higher-dimensional state spaces.

## Learned Locomotion Policies

Deep RL has produced locomotion policies that outperform hand-crafted controllers on rough terrain. The standard approach:

1. **Simulation training:** Train a policy π(aₜ | oₜ) in MuJoCo/Isaac Gym using Proximal Policy Optimization (PPO) with ~10⁹ environment steps
2. **Domain randomization:** Randomize physics parameters (mass, friction, motor gains, terrain height) during training to improve sim-to-real transfer
3. **Privileged learning (teacher-student):** Train a teacher policy with access to privileged simulation state; distill into a student policy using only realistically observable inputs
4. **Hardware deployment:** Deploy student policy at 50–200 Hz on onboard compute

ETH Zurich's ANYmal achieved parkour-level locomotion using this pipeline. Learning-based approaches naturally handle contact-rich scenarios and external disturbances that challenge model-based controllers.

## Inverse Kinematics for Motion Planning

For end-effector tracking, Jacobian-based IK computes joint velocity q̇ from desired end-effector velocity ẋ:

```
q̇ = J⁺ẋ + (I - J⁺J)q̇_null
```

where J⁺ is the Moore-Penrose pseudoinverse and the null-space term (I - J⁺J)q̇_null exploits kinematic redundancy to satisfy secondary objectives (joint limit avoidance, singularity avoidance).

## Key References

- Kajita et al. (2003). *Biped walking pattern generation by using preview control of zero-moment point.* ICRA 2003.
- Di Carlo et al. (2018). *Dynamic locomotion in the MIT cheetah 3 through convex MPC.* IROS 2018.
- Kumar et al. (2021). *RMA: Rapid Motor Adaptation for Legged Robots.* RSS 2021.
