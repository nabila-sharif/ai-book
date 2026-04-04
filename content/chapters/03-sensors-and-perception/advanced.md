# Sensors and Perception

Robot perception is the process of transforming raw sensor data into structured representations suitable for planning and control. Modern Physical AI systems employ heterogeneous sensor suites, and the central challenge is fusing these modalities into a coherent, temporally consistent world model under real-time constraints.

## Exteroceptive Sensing

**Cameras** remain the highest-information-density sensor available to robots. RGB cameras provide 2D appearance at frame rates up to 120 Hz with resolutions exceeding 4MP. Depth cameras (structured light or time-of-flight) augment RGB with per-pixel depth estimates at ranges of 0.3–5 m. Event cameras (neuromorphic sensors) encode brightness changes asynchronously at microsecond resolution, enabling motion estimation at extremely low latency — relevant for high-speed manipulation.

**LiDAR** measures distance via the time-of-flight of pulsed or FMCW laser beams, producing 3D point clouds at 10–20 Hz. Rotating mechanical LiDARs (Velodyne HDL-64E) provide 360° coverage with ~±2 cm range accuracy. Solid-state LiDARs (Livox, Ouster) reduce cost and moving parts at the expense of field-of-view. Point cloud registration algorithms (ICP, NDT) enable LiDAR odometry with centimeter-level accuracy.

**Radar** (77 GHz automotive mmWave) complements LiDAR with velocity measurement via Doppler shift and robustness to adverse weather (rain, fog, dust). Spatial resolution is inferior to LiDAR, but velocity estimation is direct rather than derived from position differentiation.

## Proprioceptive Sensing

**IMU** (Inertial Measurement Unit) integrates a 3-axis accelerometer and 3-axis MEMS gyroscope, providing angular velocity and linear acceleration at 200–1000 Hz. Raw IMU integration suffers from bias drift and noise accumulation. The Allan variance characterizes IMU noise as a function of averaging time and is used to tune filter parameters.

**Joint encoders** (incremental or absolute optical/magnetic) measure joint angles at resolutions of 12–20 bits. Paired with motor current sensing, they enable full-state estimation of joint position, velocity, and torque. Strain gauges in series with structural members provide direct force/torque sensing for contact detection and control.

**Force/torque sensors** at the wrist and foot provide 6-axis wrench measurements, enabling impedance control and ground reaction force estimation essential for stable locomotion.

## State Estimation and Sensor Fusion

The canonical state estimation formulation is probabilistic: maintain a belief distribution p(xₜ | z₁:ₜ, u₁:ₜ) over the robot state xₜ given observations z₁:ₜ and controls u₁:ₜ.

**Extended Kalman Filter (EKF):** Linearizes nonlinear process and observation models via first-order Taylor expansion. Computationally efficient (O(n²) in state dimension) but may diverge for highly nonlinear systems.

**Unscented Kalman Filter (UKF):** Uses sigma point propagation to capture second-order nonlinear effects without explicit Jacobian computation. Superior accuracy for moderately nonlinear systems at ~3× the computational cost of EKF.

**Factor graph optimization (GTSAM, g²o):** Represents the estimation problem as a graph of variables and factors, enabling batch or incremental MAP estimation. Used in visual-inertial odometry (VIO) systems like OKVIS and VINS-Mono, achieving sub-centimeter localization in real-time.

## Visual Perception Architectures

Modern object detection and semantic segmentation leverage transformer-based architectures. **ViT (Vision Transformer)** treats image patches as tokens and applies self-attention, achieving state-of-the-art performance on ImageNet with favorable scaling properties. For real-time robot perception, EfficientDet and YOLO variants remain competitive due to their favorable accuracy/latency trade-off on embedded GPUs (NVIDIA Jetson Orin: ~100 TOPS).

**3D scene understanding** increasingly uses implicit neural representations (NeRF, 3D Gaussian Splatting) for dense reconstruction from sparse views, enabling robots to build detailed scene models from onboard cameras during operation.

## Key References

- Forster et al. (2017). *SVO: Semi-Direct Visual Odometry.* IEEE T-RO.
- Dellaert & Kaess (2017). *Factor Graphs for Robot Perception.* Foundations and Trends in Robotics.
- Tancik et al. (2022). *Block-NeRF: Scalable Large Scene Neural View Synthesis.* CVPR 2022.
