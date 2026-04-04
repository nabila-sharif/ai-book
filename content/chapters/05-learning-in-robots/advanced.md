# Learning in Robots

Machine learning for robot control spans a spectrum from model-free deep reinforcement learning to model-based planning with learned world models to imitation learning from human demonstrations. Each paradigm makes distinct assumptions about data availability, sample efficiency, and generalization requirements.

## Deep Reinforcement Learning

The standard RL formulation models robot learning as a Markov Decision Process (MDP): (S, A, P, R, γ), where S is the state space, A the action space, P the transition dynamics, R the reward function, and γ ∈ [0,1) the discount factor.

**Proximal Policy Optimization (PPO)** has become the dominant on-policy algorithm for robot locomotion:

```
L_CLIP(θ) = E[min(rₜ(θ)Aₜ, clip(rₜ(θ), 1-ε, 1+ε)Aₜ)]
```

where rₜ(θ) = π_θ(aₜ|sₜ)/π_θ_old(aₜ|sₜ) is the probability ratio and Aₜ is the advantage estimate. The clip operation prevents excessively large policy updates that destabilize training.

**Soft Actor-Critic (SAC)** is the dominant off-policy algorithm for manipulation, incorporating an entropy regularization term that encourages exploration:

```
J(π) = E[Σₜ r(sₜ,aₜ) + α H(π(·|sₜ))]
```

The temperature parameter α trades off reward maximization against policy entropy. SAC achieves superior sample efficiency on dexterous manipulation benchmarks (Adroit, DexMV) compared to on-policy methods.

## Sim-to-Real Transfer

Training in physics simulation with domain randomization (DR) remains the primary method for obtaining policies that generalize to hardware. Key DR parameters:

- **Dynamics randomization:** mass, center of mass, joint damping, friction coefficients, actuator delay
- **Observation noise:** additive Gaussian noise on joint encoders and IMU readings
- **Visual domain randomization:** lighting, texture, camera intrinsics (for vision-based policies)

**Adaptive domain randomization** (ADR, OpenAI) automatically adjusts randomization bounds during training based on policy performance, progressively widening the distribution as the policy improves.

**System identification** complements DR by estimating real-world physics parameters. RMA (Rapid Motor Adaptation) trains an adaptation module that estimates extrinsic parameters (terrain friction, payload mass) from recent proprioceptive history, achieving robust locomotion on diverse terrains without explicit system identification.

## Imitation Learning

**Behavioral Cloning (BC)** trains a policy via supervised learning on a dataset D = {(oᵢ, aᵢ)} of observation-action pairs:

```
min_θ E[(o,a)~D] [‖π_θ(o) - a‖²]
```

BC suffers from distribution shift (covariate shift): the learner encounters states not in the training distribution, causing compounding errors. **DAgger** (Dataset Aggregation) addresses this by iteratively collecting additional demonstrations at states visited by the learner.

**Diffusion Policy** formulates action prediction as a conditional denoising diffusion process, modeling the multimodal action distribution inherent in human demonstrations. It significantly outperforms BC and Gaussian mixture model approaches on complex manipulation tasks requiring precise contact.

**Action Chunking with Transformers (ACT)** encodes temporal action consistency by predicting sequences of actions (chunks) rather than single actions, reducing compounding error and improving task success rates on dexterous bimanual manipulation.

## World Models and Model-Based RL

**DreamerV3** learns a recurrent world model from image observations, then trains a policy entirely within the latent imagination of the world model. This achieves ~10× greater sample efficiency than model-free methods on visual control tasks. The latent dynamics model:

```
hₜ = f(hₜ₋₁, zₜ₋₁, aₜ₋₁)    (recurrent state)
zₜ ~ p(zₜ | hₜ, oₜ)           (representation)
ôₜ ~ p(oₜ | hₜ, zₜ)           (reconstruction)
r̂ₜ ~ p(rₜ | hₜ, zₜ)           (reward prediction)
```

Policy optimization occurs by backpropagating through imagined rollouts, avoiding the need for real-world environment interactions during policy improvement.

## Key References

- Schulman et al. (2017). *Proximal Policy Optimization Algorithms.* arXiv:1707.06347.
- Chi et al. (2023). *Diffusion Policy: Visuomotor Policy Learning via Action Diffusion.* RSS 2023.
- Hafner et al. (2023). *Mastering Diverse Domains through World Models.* arXiv:2301.04104.
- Kumar et al. (2021). *RMA: Rapid Motor Adaptation for Legged Robots.* RSS 2021.
