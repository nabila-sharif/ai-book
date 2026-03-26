# Learning in Robots

For most of robotics history, behavior was programmed. Engineers wrote explicit rules: "if sensor reads X, do Y." This worked for structured environments like factory floors but broke down in the face of variability and unpredictability. The revolution in machine learning — particularly deep learning and reinforcement learning — has changed what is possible. Robots can now learn to perform complex tasks from experience, in some cases acquiring skills that surpass what any programmer could have specified by hand.

## How Robots Learn

Learning in robots is fundamentally about acquiring a **policy** — a function that maps from observations to actions. A policy might be: "given this camera image and this joint state, apply these motor torques." The goal is to find a policy that, over time, achieves good outcomes in the tasks we care about.

There are three broad approaches to learning robot behavior:

**Imitation learning** — the robot learns by watching demonstrations. A human performs a task (perhaps via teleoperation), and the robot learns to replicate that behavior. This is sample-efficient because the human is implicitly providing a lot of useful signal, but the robot is limited to behaviors it has seen demonstrated.

**Reinforcement learning (RL)** — the robot learns by trying things and receiving feedback. It takes an action, observes what happens, and receives a reward signal indicating how good the outcome was. Over thousands or millions of trials, it learns which actions lead to high cumulative reward.

**Supervised learning** — the robot learns from labeled datasets of (input, correct output) pairs. This is used primarily for perception tasks: "here is an image; the correct label is 'cup.'" For motor behavior, it requires large datasets of (state, action) pairs from expert demonstrations or offline data.

Modern systems typically combine all three: supervised learning for perception, imitation learning for an initial policy, and reinforcement learning to refine and improve beyond the demonstrated behavior.

## Reinforcement Learning

Reinforcement learning deserves special attention because it has produced some of the most impressive robot behaviors — including the locomotion controllers that let humanoids walk robustly on real terrain.

RL is formalized as a **Markov Decision Process (MDP)**: at each timestep, the agent is in a state s, takes an action a, receives a reward r, and transitions to a new state s'. The goal is to find a policy that maximizes the expected sum of future rewards.

For robotics, the reward function encodes the task. For walking: reward = forward velocity - energy consumption - penalty for falling. The robot doesn't know how to walk; it discovers walking by maximizing this reward over millions of simulated interactions.

**Deep RL** uses neural networks to represent the policy and value functions. The neural network takes in sensor readings and outputs motor commands. Training adjusts the network weights to improve expected reward.

The key challenge for applying RL to physical robots is **sample efficiency**: real robots break and take time to reset; they can't run millions of trials. **Sim-to-real transfer** addresses this by training in simulation and deploying on real hardware.

**Domain randomization** is a technique used during simulation training: vary the physics parameters (friction, mass, damping) randomly across training episodes. The policy must perform well across all these variants, which forces it to learn robust behaviors rather than ones that exploit simulation-specific quirks. When transferred to the real robot — which is just another "random" environment — the policy generalizes.

## Learning from Humans

Imitation learning from human demonstrations is increasingly practical. High-quality demonstrations can be collected via teleoperation (human controls robot with joysticks or VR controllers), kinesthetic teaching (human physically guides robot through motions), or video — learning from watching humans perform tasks on camera without any robot involvement.

**Behavior Cloning (BC)** is the simplest form: train a neural network to predict the expert's actions given the expert's observations. It is fast and sample-efficient but has a critical weakness: **distribution shift**. If the robot reaches a state slightly different from any training state (which inevitably happens), it has no signal about what to do, and errors compound.

**DAgger (Dataset Aggregation)** addresses this by interactively collecting corrections: the robot runs its learned policy, and whenever it enters a new state, a human provides the correct action. This iteratively expands the training distribution to cover the states the robot actually visits.

**Diffusion policies** and other modern generative approaches treat action generation as a denoising process, producing smooth, multi-modal action distributions that better capture the variety of human behavior.

The current frontier is **foundation models for robotics** — large models pretrained on diverse robot data and internet video, then fine-tuned for specific tasks. Models like RT-2, OpenVLA, and π0 demonstrate that language and vision understanding from internet pretraining can be transferred to physical robot control, enabling robots to generalize to new tasks from just a handful of demonstrations.
