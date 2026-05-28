import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData = await login(email, password, rememberMe);

      if (!userData?.emailConfirmed) {
        toast({
          title: "Email not confirmed",
          description: "Please confirm your email address to continue.",
          variant: "warning",
        });
        navigate("/confirm-email", { state: { email } });
        return;
      }

      toast({ title: "Welcome back!" });
      if (userData?.role === "Admin") {
        navigate("/dashboard");
      } else if (userData?.role === "Student") {
        navigate("/");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let gsap = null;
    let activeElement = null;
    let eyesCovered = false;
    let pwVisible = false;
    let mouthStatus = "small";
    let blinking = null;
    let emailScrollMax = 0;
    let svgCoords = null;
    let emailCoords = null;
    let screenCenter = 0;
    let eyeLCoords = null;
    let eyeRCoords = null;
    let noseCoords = null;
    let mouthCoords = null;

    const scripts = [];
    const listeners = [];

    const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));
    const getAngle = (x1, y1, x2, y2) => Math.atan2(y1 - y2, x1 - x2);
    const getPosition = (el) => {
      let xPos = 0;
      let yPos = 0;
      while (el) {
        if (el.tagName === "BODY") {
          xPos +=
            el.offsetLeft -
            (el.scrollLeft || document.documentElement.scrollLeft) +
            el.clientLeft;
          yPos +=
            el.offsetTop -
            (el.scrollTop || document.documentElement.scrollTop) +
            el.clientTop;
        } else {
          xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
          yPos += el.offsetTop - el.scrollTop + el.clientTop;
        }
        el = el.offsetParent;
      }
      return { x: xPos, y: yPos };
    };

    const resetFace = () => {
      if (!gsap) return;
      const eyeL = document.querySelector(".eyeL");
      const eyeR = document.querySelector(".eyeR");
      const nose = document.querySelector(".nose");
      const mouth = document.querySelector(".mouth");
      const chin = document.querySelector(".chin");
      const face = document.querySelector(".face");
      const eyebrow = document.querySelector(".eyebrow");
      const outerEarL = document.querySelector(".earL .outerEar");
      const outerEarR = document.querySelector(".earR .outerEar");
      const earHairL = document.querySelector(".earL .earHair");
      const earHairR = document.querySelector(".earR .earHair");
      const hair = document.querySelector(".hair");

      gsap.to([eyeL, eyeR], { duration: 1, x: 0, y: 0, ease: "expo.out" });
      gsap.to(nose, {
        duration: 1,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        ease: "expo.out",
      });
      gsap.to(mouth, {
        duration: 1,
        x: 0,
        y: 0,
        rotation: 0,
        ease: "expo.out",
      });
      gsap.to(chin, { duration: 1, x: 0, y: 0, scaleY: 1, ease: "expo.out" });
      gsap.to([face, eyebrow], {
        duration: 1,
        x: 0,
        y: 0,
        skewX: 0,
        ease: "expo.out",
      });
      gsap.to([outerEarL, outerEarR, earHairL, earHairR, hair], {
        duration: 1,
        x: 0,
        y: 0,
        scaleY: 1,
        ease: "expo.out",
      });
    };

    const coverEyes = () => {
      if (!gsap) return;
      const armL = document.querySelector(".armL");
      const armR = document.querySelector(".armR");
      const bodyBG = document.querySelector(".bodyBGnormal");
      const bodyBGchanged = document.querySelector(".bodyBGchanged");

      gsap.killTweensOf([armL, armR]);
      gsap.set([armL, armR], { visibility: "visible" });
      gsap.to(armL, {
        duration: 0.45,
        x: -93,
        y: 10,
        rotation: 0,
        ease: "quad.out",
      });
      gsap.to(armR, {
        duration: 0.45,
        x: -93,
        y: 10,
        rotation: 0,
        ease: "quad.out",
        delay: 0.1,
      });
      gsap.to(bodyBG, {
        duration: 0.45,
        morphSVG: bodyBGchanged,
        ease: "quad.out",
      });
      eyesCovered = true;
    };

    const uncoverEyes = () => {
      if (!gsap) return;
      const armL = document.querySelector(".armL");
      const armR = document.querySelector(".armR");
      const bodyBG = document.querySelector(".bodyBGnormal");

      gsap.killTweensOf([armL, armR]);
      gsap.to(armL, { duration: 1.35, y: 220, ease: "quad.out" });
      gsap.to(armL, {
        duration: 1.35,
        rotation: 105,
        ease: "quad.out",
        delay: 0.1,
      });
      gsap.to(armR, { duration: 1.35, y: 220, ease: "quad.out" });
      gsap.to(armR, {
        duration: 1.35,
        rotation: -105,
        ease: "quad.out",
        delay: 0.1,
        onComplete: () => {
          gsap.set([armL, armR], { visibility: "hidden" });
        },
      });
      gsap.to(bodyBG, { duration: 0.45, morphSVG: bodyBG, ease: "quad.out" });
      eyesCovered = false;
    };

    const spreadFingers = () => {
      if (!gsap) return;
      const twoFingers = document.querySelector(".twoFingers");
      gsap.to(twoFingers, {
        duration: 0.35,
        transformOrigin: "bottom left",
        rotation: 30,
        x: -9,
        y: -2,
        ease: "power2.inOut",
      });
    };

    const closeFingers = () => {
      if (!gsap) return;
      const twoFingers = document.querySelector(".twoFingers");
      gsap.to(twoFingers, {
        duration: 0.35,
        transformOrigin: "bottom left",
        rotation: 0,
        x: 0,
        y: 0,
        ease: "power2.inOut",
      });
    };

    const startBlinking = (delay) => {
      if (!gsap) return;
      const eyeL = document.querySelector(".eyeL");
      const eyeR = document.querySelector(".eyeR");
      delay = delay ? getRandomInt(delay) : 1;
      blinking = gsap.to([eyeL, eyeR], {
        duration: 0.1,
        delay,
        scaleY: 0,
        yoyo: true,
        repeat: 1,
        transformOrigin: "center center",
        onComplete: () => startBlinking(12),
      });
    };

    const calculateFaceMove = () => {
      const email = document.querySelector("#loginEmail");
      if (!email) return;
      const carPos =
        email.selectionEnd == null || email.selectionEnd === 0
          ? email.value.length
          : email.selectionEnd;
      const div = document.createElement("div");
      const span = document.createElement("span");
      const copyStyle = getComputedStyle(email);
      let caretCoords = {};

      Array.from(copyStyle).forEach((prop) => {
        div.style[prop] = copyStyle[prop];
      });
      div.style.position = "absolute";
      document.body.appendChild(div);
      div.textContent = email.value.substr(0, carPos);
      span.textContent = email.value.substr(carPos) || ".";
      div.appendChild(span);

      if (email.scrollWidth <= emailScrollMax) {
        caretCoords = getPosition(span);
        const targetX = emailCoords.x + caretCoords.x;
        const targetY = emailCoords.y + 25;
        const eyeLAngle = getAngle(
          eyeLCoords.x,
          eyeLCoords.y,
          targetX,
          targetY,
        );
        const eyeRAngle = getAngle(
          eyeRCoords.x,
          eyeRCoords.y,
          targetX,
          targetY,
        );
        const noseAngle = getAngle(
          noseCoords.x,
          noseCoords.y,
          targetX,
          targetY,
        );
        const mouthAngle = getAngle(
          mouthCoords.x,
          mouthCoords.y,
          targetX,
          targetY,
        );

        const eyeLX = Math.cos(eyeLAngle) * 20;
        const eyeLY = Math.sin(eyeLAngle) * 10;
        const eyeRX = Math.cos(eyeRAngle) * 20;
        const eyeRY = Math.sin(eyeRAngle) * 10;
        const noseX = Math.cos(noseAngle) * 23;
        const noseY = Math.sin(noseAngle) * 10;
        const mouthX = Math.cos(mouthAngle) * 23;
        const mouthY = Math.sin(mouthAngle) * 10;
        const mouthR = Math.cos(mouthAngle) * 6;
        const chinX = mouthX * 0.8;
        const chinY = mouthY * 0.5;
        const chinS = Math.max(0.5, 1 - (screenCenter - targetX * 0.15) / 100);
        const faceX = mouthX * 0.3;
        const faceY = mouthY * 0.4;
        const faceSkew = Math.cos(mouthAngle) * 5;
        const eyebrowSkew = Math.cos(mouthAngle) * 25;
        const outerEarX = Math.cos(mouthAngle) * 4;
        const outerEarY = Math.cos(mouthAngle) * 5;
        const hairX = Math.cos(mouthAngle) * 6;
        const hairS = 1.2;

        gsap.to(document.querySelector(".eyeL"), {
          duration: 1,
          x: -eyeLX,
          y: -eyeLY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".eyeR"), {
          duration: 1,
          x: -eyeRX,
          y: -eyeRY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".nose"), {
          duration: 1,
          x: -noseX,
          y: -noseY,
          rotation: mouthR,
          transformOrigin: "center center",
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".mouth"), {
          duration: 1,
          x: -mouthX,
          y: -mouthY,
          rotation: mouthR,
          transformOrigin: "center center",
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".chin"), {
          duration: 1,
          x: -chinX,
          y: -chinY,
          scaleY: chinS,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".face"), {
          duration: 1,
          x: -faceX,
          y: -faceY,
          skewX: -faceSkew,
          transformOrigin: "center top",
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".eyebrow"), {
          duration: 1,
          x: -faceX,
          y: -faceY,
          skewX: -eyebrowSkew,
          transformOrigin: "center top",
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".earL .outerEar"), {
          duration: 1,
          x: outerEarX,
          y: -outerEarY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".earR .outerEar"), {
          duration: 1,
          x: outerEarX,
          y: outerEarY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".earL .earHair"), {
          duration: 1,
          x: -outerEarX,
          y: -outerEarY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".earR .earHair"), {
          duration: 1,
          x: -outerEarX,
          y: outerEarY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".hair"), {
          duration: 1,
          x: hairX,
          scaleY: hairS,
          transformOrigin: "center bottom",
          ease: "expo.out",
        });
      } else {
        caretCoords = getPosition(span);
        const scrollTargetX = emailCoords.x + emailScrollMax;
        const scrollTargetY = emailCoords.y + 25;
        const eyeLAngle = getAngle(
          eyeLCoords.x,
          eyeLCoords.y,
          scrollTargetX,
          scrollTargetY,
        );
        const eyeRAngle = getAngle(
          eyeRCoords.x,
          eyeRCoords.y,
          scrollTargetX,
          scrollTargetY,
        );
        const noseAngle = getAngle(
          noseCoords.x,
          noseCoords.y,
          scrollTargetX,
          scrollTargetY,
        );
        const mouthAngle = getAngle(
          mouthCoords.x,
          mouthCoords.y,
          scrollTargetX,
          scrollTargetY,
        );
        const eyeLX = Math.cos(eyeLAngle) * 20;
        const eyeLY = Math.sin(eyeLAngle) * 10;
        const eyeRX = Math.cos(eyeRAngle) * 20;
        const eyeRY = Math.sin(eyeRAngle) * 10;
        const noseX = Math.cos(noseAngle) * 23;
        const noseY = Math.sin(noseAngle) * 10;
        const mouthX = Math.cos(mouthAngle) * 23;
        const mouthY = Math.sin(mouthAngle) * 10;
        const mouthR = Math.cos(mouthAngle) * 6;
        const chinX = mouthX * 0.8;
        const chinY = mouthY * 0.5;
        const chinS = Math.max(
          0.5,
          1 - ((screenCenter - scrollTargetX) * 0.15) / 100,
        );
        const faceX = mouthX * 0.3;
        const faceY = mouthY * 0.4;
        const faceSkew = Math.cos(mouthAngle) * 5;
        const eyebrowSkew = Math.cos(mouthAngle) * 25;
        const outerEarX = Math.cos(mouthAngle) * 4;
        const outerEarY = Math.cos(mouthAngle) * 5;
        const hairX = Math.cos(mouthAngle) * 6;
        const hairS = 1.2;

        gsap.to(document.querySelector(".eyeL"), {
          duration: 1,
          x: -eyeLX,
          y: -eyeLY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".eyeR"), {
          duration: 1,
          x: -eyeRX,
          y: -eyeRY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".nose"), {
          duration: 1,
          x: -noseX,
          y: -noseY,
          rotation: mouthR,
          transformOrigin: "center center",
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".mouth"), {
          duration: 1,
          x: -mouthX,
          y: -mouthY,
          rotation: mouthR,
          transformOrigin: "center center",
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".chin"), {
          duration: 1,
          x: -chinX,
          y: -chinY,
          scaleY: chinS,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".face"), {
          duration: 1,
          x: -faceX,
          y: -faceY,
          skewX: -faceSkew,
          transformOrigin: "center top",
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".eyebrow"), {
          duration: 1,
          x: -faceX,
          y: -faceY,
          skewX: -eyebrowSkew,
          transformOrigin: "center top",
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".earL .outerEar"), {
          duration: 1,
          x: outerEarX,
          y: -outerEarY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".earR .outerEar"), {
          duration: 1,
          x: outerEarX,
          y: outerEarY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".earL .earHair"), {
          duration: 1,
          x: -outerEarX,
          y: -outerEarY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".earR .earHair"), {
          duration: 1,
          x: -outerEarX,
          y: outerEarY,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".hair"), {
          duration: 1,
          x: hairX,
          scaleY: hairS,
          transformOrigin: "center bottom",
          ease: "expo.out",
        });
      }

      document.body.removeChild(div);
    };

    const onEmailInput = () => {
      const email = document.querySelector("#loginEmail");
      if (!email) return;
      calculateFaceMove();
      const value = email.value;
      const curEmailIndex = value.length;

      if (curEmailIndex > 0) {
        if (mouthStatus === "small") {
          mouthStatus = "medium";
          gsap.to(
            [
              document.querySelector(".mouthBG"),
              document.querySelector(".mouthOutline"),
              document.querySelector("#mouthMaskPath"),
            ],
            {
              duration: 1,
              morphSVG: document.querySelector(".mouthMediumBG"),
              ease: "expo.out",
            },
          );
          gsap.to(document.querySelector(".tooth"), {
            duration: 1,
            x: 0,
            y: 0,
            ease: "expo.out",
          });
          gsap.to(document.querySelector(".tongue"), {
            duration: 1,
            x: 0,
            y: 1,
            ease: "expo.out",
          });
          gsap.to(
            [document.querySelector(".eyeL"), document.querySelector(".eyeR")],
            { duration: 1, scaleX: 0.85, scaleY: 0.85, ease: "expo.out" },
          );
        }
        if (value.includes("@")) {
          mouthStatus = "large";
          gsap.to(
            [
              document.querySelector(".mouthBG"),
              document.querySelector(".mouthOutline"),
              document.querySelector("#mouthMaskPath"),
            ],
            {
              duration: 1,
              morphSVG: document.querySelector(".mouthLargeBG"),
              ease: "expo.out",
            },
          );
          gsap.to(document.querySelector(".tooth"), {
            duration: 1,
            x: 3,
            y: -2,
            ease: "expo.out",
          });
          gsap.to(document.querySelector(".tongue"), {
            duration: 1,
            y: 2,
            ease: "expo.out",
          });
          gsap.to(
            [document.querySelector(".eyeL"), document.querySelector(".eyeR")],
            {
              duration: 1,
              scaleX: 0.65,
              scaleY: 0.65,
              ease: "expo.out",
              transformOrigin: "center center",
            },
          );
        } else {
          mouthStatus = "medium";
          gsap.to(
            [
              document.querySelector(".mouthBG"),
              document.querySelector(".mouthOutline"),
              document.querySelector("#mouthMaskPath"),
            ],
            {
              duration: 1,
              morphSVG: document.querySelector(".mouthMediumBG"),
              ease: "expo.out",
            },
          );
          gsap.to(document.querySelector(".tooth"), {
            duration: 1,
            x: 0,
            y: 0,
            ease: "expo.out",
          });
          gsap.to(document.querySelector(".tongue"), {
            duration: 1,
            x: 0,
            y: 1,
            ease: "expo.out",
          });
          gsap.to(
            [document.querySelector(".eyeL"), document.querySelector(".eyeR")],
            { duration: 1, scaleX: 0.85, scaleY: 0.85, ease: "expo.out" },
          );
        }
      } else {
        mouthStatus = "small";
        gsap.to(
          [
            document.querySelector(".mouthBG"),
            document.querySelector(".mouthOutline"),
            document.querySelector("#mouthMaskPath"),
          ],
          {
            duration: 1,
            morphSVG: document.querySelector(".mouthSmallBG"),
            ease: "expo.out",
          },
        );
        gsap.to(document.querySelector(".tooth"), {
          duration: 1,
          x: 0,
          y: 0,
          ease: "expo.out",
        });
        gsap.to(document.querySelector(".tongue"), {
          duration: 1,
          y: 0,
          ease: "expo.out",
        });
        gsap.to(
          [document.querySelector(".eyeL"), document.querySelector(".eyeR")],
          { duration: 1, scaleX: 1, scaleY: 1, ease: "expo.out" },
        );
      }
    };

    const resetMouth = () => {
      if (!gsap) return;
      mouthStatus = "small";
      gsap.to(
        [
          document.querySelector(".mouthBG"),
          document.querySelector(".mouthOutline"),
          document.querySelector("#mouthMaskPath"),
        ],
        {
          duration: 0.8,
          morphSVG: document.querySelector(".mouthSmallBG"),
          ease: "expo.out",
        },
      );
      gsap.to(document.querySelector(".tooth"), {
        duration: 0.8,
        x: 0,
        y: 0,
        ease: "expo.out",
      });
      gsap.to(document.querySelector(".tongue"), {
        duration: 0.8,
        y: 0,
        ease: "expo.out",
      });
      gsap.to(
        [document.querySelector(".eyeL"), document.querySelector(".eyeR")],
        { duration: 0.8, scaleX: 1, scaleY: 1, ease: "expo.out" },
      );
    };

    const onEmailFocus = (e) => {
      activeElement = "email";
      e.target.parentElement.classList.add("focusWithText");
      onEmailInput();
    };

    const onEmailBlur = (e) => {
      activeElement = null;
      setTimeout(() => {
        if (activeElement === "email") return;
        if (e.target.value === "")
          e.target.parentElement.classList.remove("focusWithText");
        resetFace();
        resetMouth();
      }, 100);
    };

    const onPasswordFocus = () => {
      activeElement = "password";
      if (!eyesCovered) coverEyes();
    };

    const onPasswordBlur = () => {
      activeElement = null;
      setTimeout(() => {
        if (activeElement === "toggle" || activeElement === "password") return;
        uncoverEyes();
      }, 100);
    };

    const onToggleFocus = () => {
      activeElement = "toggle";
      if (!eyesCovered) coverEyes();
    };

    const onToggleBlur = () => {
      activeElement = null;
      setTimeout(() => {
        if (activeElement === "toggle" || activeElement === "password") return;
        uncoverEyes();
      }, 100);
    };

    const onToggleClick = () => {
      const password = document.querySelector("#loginPassword");
      const iconOpen = document.querySelector("#iconOpen");
      const iconClosed = document.querySelector("#iconClosed");
      pwVisible = !pwVisible;
      if (password) {
        password.type = pwVisible ? "text" : "password";
      }
      if (iconOpen) {
        iconOpen.style.display = pwVisible ? "none" : "block";
      }
      if (iconClosed) {
        iconClosed.style.display = pwVisible ? "block" : "none";
      }
      const button = document.querySelector("#eyeToggleBtn");
      if (button) {
        button.setAttribute(
          "aria-label",
          pwVisible ? "Hide password" : "Show password",
        );
      }
      if (pwVisible) {
        spreadFingers();
      } else {
        closeFingers();
      }
    };

    const initLoginForm = () => {
      gsap = window.gsap;
      if (!gsap) return;
      const mySVG = document.querySelector(".svgContainer");
      const email = document.querySelector("#loginEmail");
      const password = document.querySelector("#loginPassword");
      const eyeToggleBtn = document.querySelector("#eyeToggleBtn");
      const emailLabel = document.querySelector("#loginEmailLabel");

      if (!mySVG || !email || !password || !eyeToggleBtn || !emailLabel) return;

      svgCoords = getPosition(mySVG);
      emailCoords = getPosition(email);
      screenCenter = svgCoords.x + mySVG.offsetWidth / 2;
      eyeLCoords = { x: svgCoords.x + 84, y: svgCoords.y + 76 };
      eyeRCoords = { x: svgCoords.x + 113, y: svgCoords.y + 76 };
      noseCoords = { x: svgCoords.x + 97, y: svgCoords.y + 81 };
      mouthCoords = { x: svgCoords.x + 100, y: svgCoords.y + 100 };

      const onEmailLabelClick = () => {
        activeElement = "email";
      };

      email.addEventListener("focus", onEmailFocus);
      email.addEventListener("blur", onEmailBlur);
      email.addEventListener("input", onEmailInput);
      emailLabel.addEventListener("click", onEmailLabelClick);

      password.addEventListener("focus", onPasswordFocus);
      password.addEventListener("blur", onPasswordBlur);

      eyeToggleBtn.addEventListener("focus", onToggleFocus);
      eyeToggleBtn.addEventListener("blur", onToggleBlur);
      eyeToggleBtn.addEventListener("click", onToggleClick);

      listeners.push({ el: email, event: "focus", fn: onEmailFocus });
      listeners.push({ el: email, event: "blur", fn: onEmailBlur });
      listeners.push({ el: email, event: "input", fn: onEmailInput });
      listeners.push({ el: emailLabel, event: "click", fn: onEmailLabelClick });
      listeners.push({ el: password, event: "focus", fn: onPasswordFocus });
      listeners.push({ el: password, event: "blur", fn: onPasswordBlur });
      listeners.push({ el: eyeToggleBtn, event: "focus", fn: onToggleFocus });
      listeners.push({ el: eyeToggleBtn, event: "blur", fn: onToggleBlur });
      listeners.push({ el: eyeToggleBtn, event: "click", fn: onToggleClick });

      gsap.set(document.querySelector(".armL"), {
        x: -93,
        y: 220,
        rotation: 105,
        transformOrigin: "top left",
      });
      gsap.set(document.querySelector(".armR"), {
        x: -93,
        y: 220,
        rotation: -105,
        transformOrigin: "top right",
      });
      gsap.set(document.querySelector(".mouth"), {
        transformOrigin: "center center",
      });

      emailScrollMax = email.scrollWidth;
      startBlinking(5);
      console.clear();
    };

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve(script);
        script.onerror = reject;
        document.body.appendChild(script);
        scripts.push(script);
      });

    let mounted = true;
    loadScript("https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js")
      .then(() =>
        loadScript(
          "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/MorphSVGPlugin.min.js",
        ),
      )
      .then(() => {
        if (!mounted) return;
        gsap = window.gsap;
        const MorphSVGPlugin =
          window.MorphSVGPlugin || window.gsap?.plugins?.MorphSVGPlugin;
        if (gsap && MorphSVGPlugin) {
          gsap.registerPlugin(MorphSVGPlugin);
        }
        initLoginForm();
      })
      .catch((error) => {
        console.error("Failed to load yeti animation scripts", error);
      });

    return () => {
      mounted = false;
      listeners.forEach(({ el, event, fn }) =>
        el.removeEventListener(event, fn),
      );
      scripts.forEach((script) => script.parentNode?.removeChild(script));
      if (blinking && blinking.kill) {
        blinking.kill();
      }
    };
  }, []);

  return (
    <div className="login-page">
      <svg
        id="bgSVG"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="1440" height="900" fill="hsl(174 72% 96%)" />
        <polygon
          points="0,900 220,420 440,900"
          fill="hsl(174 72% 88%)"
          opacity="0.7"
        />
        <polygon
          points="180,900 460,340 740,900"
          fill="hsl(174 72% 80%)"
          opacity="0.5"
        />
        <polygon
          points="700,900 950,280 1200,900"
          fill="hsl(174 72% 88%)"
          opacity="0.7"
        />
        <polygon
          points="1000,900 1220,380 1440,900"
          fill="hsl(174 72% 80%)"
          opacity="0.5"
        />
        <polygon
          points="300,900 520,460 740,900"
          fill="hsl(174 72% 80%)"
          opacity="0.6"
        />
        <polygon
          points="1100,900 1300,430 1440,700"
          fill="hsl(174 72% 80%)"
          opacity="0.5"
        />
        <polygon points="220,420 260,480 180,480" fill="white" opacity="0.6" />
        <polygon points="460,340 510,420 410,420" fill="white" opacity="0.6" />
        <polygon points="950,280 1005,370 895,370" fill="white" opacity="0.6" />
        <polygon
          points="1220,380 1265,450 1175,450"
          fill="white"
          opacity="0.6"
        />
        <polygon points="520,460 558,520 482,520" fill="white" opacity="0.5" />
        <g
          stroke="hsl(174 72% 45%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        >
          <line x1="80" y1="120" x2="80" y2="160" />
          <line x1="60" y1="140" x2="100" y2="140" />
          <line x1="65" y1="125" x2="95" y2="155" />
          <line x1="95" y1="125" x2="65" y2="155" />
        </g>
        <g
          stroke="hsl(174 72% 45%)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        >
          <line x1="140" y1="280" x2="140" y2="310" />
          <line x1="125" y1="295" x2="155" y2="295" />
          <line x1="129" y1="284" x2="151" y2="306" />
          <line x1="151" y1="284" x2="129" y2="306" />
        </g>
        <g
          stroke="hsl(174 72% 45%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        >
          <line x1="60" y1="500" x2="60" y2="540" />
          <line x1="40" y1="520" x2="80" y2="520" />
          <line x1="45" y1="505" x2="75" y2="535" />
          <line x1="75" y1="505" x2="45" y2="535" />
        </g>
        <g
          stroke="hsl(174 72% 45%)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        >
          <line x1="170" y1="680" x2="170" y2="705" />
          <line x1="158" y1="692" x2="182" y2="692" />
          <line x1="162" y1="683" x2="178" y2="701" />
          <line x1="178" y1="683" x2="162" y2="701" />
        </g>
        <g
          stroke="hsl(174 72% 45%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        >
          <line x1="1360" y1="150" x2="1360" y2="190" />
          <line x1="1340" y1="170" x2="1380" y2="170" />
          <line x1="1345" y1="155" x2="1375" y2="185" />
          <line x1="1375" y1="155" x2="1345" y2="185" />
        </g>
        <g
          stroke="hsl(174 72% 45%)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.45"
        >
          <line x1="1300" y1="310" x2="1300" y2="338" />
          <line x1="1286" y1="324" x2="1314" y2="324" />
          <line x1="1290" y1="313" x2="1310" y2="335" />
          <line x1="1310" y1="313" x2="1290" y2="335" />
        </g>
        <g
          stroke="hsl(174 72% 45%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        >
          <line x1="1380" y1="480" x2="1380" y2="520" />
          <line x1="1360" y1="500" x2="1400" y2="500" />
          <line x1="1365" y1="485" x2="1395" y2="515" />
          <line x1="1395" y1="485" x2="1365" y2="515" />
        </g>
        <g
          stroke="hsl(174 72% 45%)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        >
          <line x1="1270" y1="700" x2="1270" y2="724" />
          <line x1="1258" y1="712" x2="1282" y2="712" />
          <line x1="1262" y1="703" x2="1278" y2="721" />
          <line x1="1278" y1="703" x2="1262" y2="721" />
        </g>
        <g fill="hsl(174 72% 80%)" opacity="0.5">
          <ellipse
            cx="100"
            cy="820"
            rx="14"
            ry="20"
            transform="rotate(-15,100,820)"
          />
          <ellipse
            cx="88"
            cy="800"
            rx="7"
            ry="9"
            transform="rotate(-15,88,800)"
          />
          <ellipse
            cx="97"
            cy="796"
            rx="7"
            ry="9"
            transform="rotate(-15,97,796)"
          />
          <ellipse
            cx="107"
            cy="797"
            rx="7"
            ry="9"
            transform="rotate(-15,107,797)"
          />
          <ellipse
            cx="145"
            cy="775"
            rx="14"
            ry="20"
            transform="rotate(-10,145,775)"
          />
          <ellipse
            cx="133"
            cy="756"
            rx="7"
            ry="9"
            transform="rotate(-10,133,756)"
          />
          <ellipse
            cx="143"
            cy="751"
            rx="7"
            ry="9"
            transform="rotate(-10,143,751)"
          />
          <ellipse
            cx="153"
            cy="753"
            rx="7"
            ry="9"
            transform="rotate(-10,153,753)"
          />
          <ellipse
            cx="185"
            cy="730"
            rx="13"
            ry="18"
            transform="rotate(-8,185,730)"
          />
          <ellipse
            cx="174"
            cy="713"
            rx="6"
            ry="8"
            transform="rotate(-8,174,713)"
          />
          <ellipse
            cx="183"
            cy="709"
            rx="6"
            ry="8"
            transform="rotate(-8,183,709)"
          />
          <ellipse
            cx="193"
            cy="711"
            rx="6"
            ry="8"
            transform="rotate(-8,193,711)"
          />
        </g>
        <g fill="hsl(174 72% 80%)" opacity="0.5">
          <ellipse
            cx="1340"
            cy="820"
            rx="14"
            ry="20"
            transform="rotate(15,1340,820)"
          />
          <ellipse
            cx="1352"
            cy="800"
            rx="7"
            ry="9"
            transform="rotate(15,1352,800)"
          />
          <ellipse
            cx="1343"
            cy="796"
            rx="7"
            ry="9"
            transform="rotate(15,1343,796)"
          />
          <ellipse
            cx="1333"
            cy="797"
            rx="7"
            ry="9"
            transform="rotate(15,1333,797)"
          />
          <ellipse
            cx="1295"
            cy="775"
            rx="14"
            ry="20"
            transform="rotate(10,1295,775)"
          />
          <ellipse
            cx="1307"
            cy="756"
            rx="7"
            ry="9"
            transform="rotate(10,1307,756)"
          />
          <ellipse
            cx="1297"
            cy="751"
            rx="7"
            ry="9"
            transform="rotate(10,1297,751)"
          />
          <ellipse
            cx="1287"
            cy="753"
            rx="7"
            ry="9"
            transform="rotate(10,1287,753)"
          />
          <ellipse
            cx="1255"
            cy="730"
            rx="13"
            ry="18"
            transform="rotate(8,1255,730)"
          />
          <ellipse
            cx="1266"
            cy="713"
            rx="6"
            ry="8"
            transform="rotate(8,1266,713)"
          />
          <ellipse
            cx="1257"
            cy="709"
            rx="6"
            ry="8"
            transform="rotate(8,1257,709)"
          />
          <ellipse
            cx="1247"
            cy="711"
            rx="6"
            ry="8"
            transform="rotate(8,1247,711)"
          />
        </g>
        <circle cx="200" cy="200" r="4" fill="white" opacity="0.7" />
        <circle cx="350" cy="80" r="3" fill="white" opacity="0.6" />
        <circle cx="120" cy="380" r="5" fill="white" opacity="0.5" />
        <circle cx="1250" cy="180" r="4" fill="white" opacity="0.7" />
        <circle cx="1100" cy="90" r="3" fill="white" opacity="0.5" />
        <circle cx="1320" cy="360" r="5" fill="white" opacity="0.5" />
        <circle cx="400" cy="700" r="3" fill="white" opacity="0.4" />
        <circle cx="1050" cy="720" r="3" fill="white" opacity="0.4" />
        <g opacity="0.35">
          <circle r="4" fill="white">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              path="M250,50 C260,200 240,400 250,600"
            />
          </circle>
          <circle r="3" fill="white">
            <animateMotion
              dur="11s"
              repeatCount="indefinite"
              path="M1180,30 C1190,250 1170,500 1180,750"
            />
          </circle>
          <circle r="5" fill="#c8e6c9">
            <animateMotion
              dur="14s"
              repeatCount="indefinite"
              path="M90,0 C100,300 80,600 90,900"
            />
          </circle>
          <circle r="3" fill="white">
            <animateMotion
              dur="9s"
              repeatCount="indefinite"
              path="M1350,100 C1360,350 1340,600 1350,850"
            />
          </circle>
          <circle r="4" fill="#dcedc8">
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              path="M600,0 C610,300 590,600 600,900"
            />
          </circle>
          <circle r="3" fill="white">
            <animateMotion
              dur="10s"
              repeatCount="indefinite"
              path="M850,50 C860,280 840,550 850,800"
            />
          </circle>
        </g>
      </svg>

      <div className="login-page__content">
        <article className="login-page__card">
          <div className="login-page__panel">
            <div className="login-page__panel-inner">
              <div className="login-page__panel-body">
                <div className="login-page__yeti-block">
                  <div className="login-page__svg-card">
                    <div className="svgContainer">
                      <div>
                        <svg
                          className="mySVG"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 200 200"
                        >
                          <defs>
                            <circle
                              id="armMaskPath"
                              cx="100"
                              cy="100"
                              r="100"
                            />
                          </defs>
                          <clipPath id="armMask">
                            <use xlinkHref="#armMaskPath" overflow="visible" />
                          </clipPath>
                          <circle
                            cx="100"
                            cy="100"
                            r="100"
                            fill="hsl(174 72% 32%)"
                          />
                          <g className="body">
                            <path
                              className="bodyBGnormal"
                              stroke="hsl(174 72% 32%)"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="#ffffff"
                              d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z"
                            />
                            <path
                              fill="hsl(174 72% 88%)"
                              d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z"
                            />
                          </g>
                          <g className="earL">
                            <g
                              className="outerEar"
                              fill="hsl(174 72% 96%)"
                              stroke="hsl(174 72% 32%)"
                              strokeWidth="2.5"
                            >
                              <circle cx="47" cy="83" r="11.5" />
                              <path
                                d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                            <g className="earHair">
                              <rect
                                x="51"
                                y="64"
                                fill="#ffffff"
                                width="15"
                                height="35"
                              />
                              <path
                                d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9"
                                fill="#fff"
                                stroke="hsl(174 72% 32%)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                          </g>
                          <g className="earR">
                            <g
                              className="outerEar"
                              fill="hsl(174 72% 96%)"
                              stroke="hsl(174 72% 32%)"
                              strokeWidth="2.5"
                            >
                              <circle cx="153" cy="83" r="11.5" />
                              <path
                                d="M153.7,78.9c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1"
                                fill="hsl(174 72% 96%)"
                                stroke="hsl(174 72% 32%)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                            <g className="earHair">
                              <rect
                                x="134"
                                y="64"
                                fill="#ffffff"
                                width="15"
                                height="35"
                              />
                              <path
                                d="M146.6,62.8c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5c-1.2-0.7-3.4-1.4-5.2-1.9"
                                fill="#fff"
                                stroke="hsl(174 72% 32%)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                          </g>
                          <path
                            className="chin"
                            d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1"
                            fill="none"
                            stroke="hsl(174 72% 32%)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            className="face"
                            fill="hsl(174 72% 96%)"
                            d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46"
                          />
                          <path
                            className="hair"
                            fill="#ffffff"
                            stroke="hsl(174 72% 32%)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M81.457,27.929c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474"
                          />
                          <g className="eyebrow">
                            <path
                              fill="#ffffff"
                              d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z"
                            />
                            <path
                              fill="#ffffff"
                              stroke="hsl(174 72% 32%)"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M63.56,55.102c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037c4.913-0.481,9.857-1.34,14.787-2.599"
                            />
                          </g>
                          <g className="eyeL">
                            <circle
                              cx="85.5"
                              cy="78.5"
                              r="3.5"
                              fill="hsl(174 72% 20%)"
                            />
                            <circle cx="84" cy="76" r="1" fill="#fff" />
                          </g>
                          <g className="eyeR">
                            <circle
                              cx="114.5"
                              cy="78.5"
                              r="3.5"
                              fill="hsl(174 72% 20%)"
                            />
                            <circle cx="113" cy="76" r="1" fill="#fff" />
                          </g>
                          <g className="mouth">
                            <path
                              className="mouthBG"
                              fill="hsl(174 72% 32%)"
                              d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                            />
                            <path
                              className="mouthOutline"
                              fill="none"
                              stroke="hsl(174 72% 32%)"
                              strokeWidth="2.5"
                              strokeLinejoin="round"
                              d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                            />
                            <path
                              style={{ display: "none" }}
                              className="mouthSmallBG"
                              fill="hsl(174 72% 32%)"
                              d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                            />
                            <path
                              style={{ display: "none" }}
                              className="mouthMediumBG"
                              d="M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2c0,4.5-3.7,8.2-8.2,8.2H95z"
                            />
                            <path
                              style={{ display: "none" }}
                              className="mouthLargeBG"
                              d="M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z"
                              fill="hsl(174 72% 32%)"
                              stroke="hsl(174 72% 32%)"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                            />
                            <defs>
                              <path
                                id="mouthMaskPath"
                                d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                              />
                            </defs>
                            <clipPath id="mouthMask">
                              <use
                                xlinkHref="#mouthMaskPath"
                                overflow="visible"
                              />
                            </clipPath>
                            <g clipPath="url(#mouthMask)">
                              <g className="tongue">
                                <circle
                                  cx="100"
                                  cy="107"
                                  r="8"
                                  fill="#cc4a6c"
                                />
                                <ellipse
                                  className="tongueHighlight"
                                  cx="100"
                                  cy="100.5"
                                  rx="3"
                                  ry="1.5"
                                  opacity=".1"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                            <path
                              clipPath="url(#mouthMask)"
                              className="tooth"
                              fill="#FFFFFF"
                              d="M106,97h-4c-1.1,0-2-0.9-2-2v-2h8v2C108,96.1,107.1,97,106,97z"
                            />
                          </g>
                          <path
                            className="nose"
                            d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z"
                            fill="hsl(174 72% 32%)"
                          />
                          <g className="arms" clipPath="url(#armMask)">
                            <g
                              className="armL"
                              style={{ visibility: "hidden" }}
                            >
                              <polygon
                                fill="#e8f5e9"
                                stroke="hsl(174 72% 32%)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                points="121.3,98.4 111,59.7 149.8,49.3 169.8,85.4"
                              />
                              <path
                                fill="#e8f5e9"
                                stroke="hsl(174 72% 32%)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                d="M134.4,53.5l19.3-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-10.3,2.8"
                              />
                              <path
                                fill="#e8f5e9"
                                stroke="hsl(174 72% 32%)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                d="M150.9,59.4l26-7c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-21.3,5.7"
                              />
                              <g className="twoFingers">
                                <path
                                  fill="#e8f5e9"
                                  stroke="hsl(174 72% 32%)"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  d="M158.3,67.8l23.1-6.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-23.1,6.2"
                                />
                                <path
                                  fill="#a5d6a7"
                                  d="M180.1,65l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L180.1,65z"
                                />
                                <path
                                  fill="#e8f5e9"
                                  stroke="hsl(174 72% 32%)"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="10"
                                  d="M160.8,77.5l19.4-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-18.3,4.9"
                                />
                                <path
                                  fill="hsl(174 72% 32%)"
                                  d="M178.8,75.7l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L178.8,75.7z"
                                />
                              </g>
                              <path
                                fill="hsl(174 72% 32%)"
                                d="M175.5,55.9l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L175.5,55.9z"
                              />
                              <path
                                fill="hsl(174 72% 32%)"
                                d="M152.1,50.4l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L152.1,50.4z"
                              />
                              <path
                                fill="#ffffff"
                                stroke="hsl(174 72% 32%)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M123.5,97.8c-41.4,14.9-84.1,30.7-108.2,35.5L1.2,81c33.5-9.9,71.9-16.5,111.9-21.8"
                              />
                              <path
                                fill="#ffffff"
                                stroke="hsl(174 72% 32%)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M108.5,60.4c7.7-5.3,14.3-8.4,22.8-13.2c-2.4,5.3-4.7,10.3-6.7,15.1c4.3,0.3,8.4,0.7,12.3,1.3c-4.2,5-8.1,9.6-11.5,13.9c3.1,1.1,6,2.4,8.7,3.8c-1.4,2.9-2.7,5.8-3.9,8.5c2.5,3.5,4.6,7.2,6.3,11c-4.9-0.8-9-0.7-16.2-2.7"
                              />
                              <path
                                fill="#ffffff"
                                stroke="hsl(174 72% 32%)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M94.5,103.8c-0.6,4-3.8,8.9-9.4,14.7c-2.6-1.8-5-3.7-7.2-5.7c-2.5,4.1-6.6,8.8-12.2,14c-1.9-2.2-3.4-4.5-4.5-6.9c-4.4,3.3-9.5,6.9-15.4,10.8c-0.2-3.4,0.1-7.1,1.1-10.9"
                              />
                              <path
                                fill="#ffffff"
                                stroke="hsl(174 72% 32%)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M97.5,63.9c-1.7-2.4-5.9-4.1-12.4-5.2c-0.9,2.2-1.8,4.3-2.5,6.5c-3.8-1.8-9.4-3.1-17-3.8c0.5,2.3,1.2,4.5,1.9,6.8c-5-0.6-11.2-0.9-18.4-1c2,2.9,0.9,3.5,3.9,6.2"
                              />
                            </g>
                            <g
                              className="armR"
                              style={{ visibility: "hidden" }}
                            >
                              <path
                                fill="#e8f5e9"
                                stroke="hsl(174 72% 32%)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                strokeWidth="2.5"
                                d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z"
                              />
                              <path
                                fill="#e8f5e9"
                                stroke="hsl(174 72% 32%)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                strokeWidth="2.5"
                                d="M252.4 52.4L233 47.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l10.3 2.8M226 76.4l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M228.4 66.7l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M235.8 58.3l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7"
                              />
                              <path
                                fill="hsl(174 72% 32%)"
                                d="M207.9 74.7l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM206.7 64l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM211.2 54.8l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM234.6 49.4l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8z"
                              />
                              <path
                                fill="#fff"
                                stroke="hsl(174 72% 32%)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M263.3 96.7c41.4 14.9 84.1 30.7 108.2 35.5l14-52.3C352 70 313.6 63.5 273.6 58.1"
                              />
                              <path
                                fill="#fff"
                                stroke="hsl(174 72% 32%)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M278.2 59.3l-18.6-10 2.5 11.9-10.7 6.5 9.9 8.7-13.9 6.4 9.1 5.9-13.2 9.2 23.1-.9M284.5 100.1c-.4 4 1.8 8.9 6.7 14.8 3.5-1.8 6.7-3.6 9.7-5.5 1.8 4.2 5.1 8.9 10.1 14.1 2.7-2.1 5.1-4.4 7.1-6.8 4.1 3.4 9 7 14.7 11 1.2-3.4 1.8-7 1.7-10.9M314 66.7s5.4-5.7 12.6-7.4c1.7 2.9 3.3 5.7 4.9 8.6 3.8-2.5 9.8-4.4 18.2-5.7.1 3.1.1 6.1 0 9.2 5.5-1 12.5-1.6 20.8-1.9-1.4 3.9-2.5 8.4-2.5 8.4"
                              />
                            </g>
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-shell">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="inputGroup">
                      <label htmlFor="loginEmail" id="loginEmailLabel">
                        Email
                      </label>
                      <input
                        id="loginEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@domain.com"
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className="inputGroup">
                      <label htmlFor="loginPassword" id="loginPasswordLabel">
                        Password
                      </label>
                      <div className="pwWrap">
                        <input
                          id="loginPassword"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          id="eyeToggleBtn"
                          aria-label="Show password"
                        >
                          <svg
                            id="iconOpen"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <svg
                            id="iconClosed"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ display: "none" }}
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        </button>
                      </div>
                      <div className="forgotWrap">
                        <Link to="/forgot-password">Forgot password?</Link>
                      </div>
                    </div>

                    <div className="inputGroup">
                      <button
                        className="login-button"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in…" : "Log in"}
                      </button>
                    </div>
                  </form>

                  <p className="login-page__footer">
                    Don&apos;t have an account?{" "}
                    <Link to="/register">Create one</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Login;
