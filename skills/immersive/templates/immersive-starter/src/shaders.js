export const skyShader = {
  vertexShader: `varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `varying vec3 vP;
    float h(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
    float n(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
    float fbm(vec3 p){float f=0.,a=.5;for(int i=0;i<5;i++){f+=a*n(p);p*=2.02;a*=.5;}return f;}
    void main(){ float y=vP.y; vec3 c=mix(vec3(.07,.11,.15),vec3(.012,.02,.035),smoothstep(0.,.55,y));
      float cl=smoothstep(.45,.8,fbm(vP*vec3(3.,6.,3.)+3.)); c+=cl*.06*smoothstep(-.05,.3,y);
      float st=step(.9975,h(floor(vP*340.)))*smoothstep(.05,.4,y); c+=st*.7;
      gl_FragColor=vec4(c,1.); }`,
};

// Fake refraction: each colour channel looks up the sky at a slightly different angle. Cheap, and it reads as glass.
export const crystalShader = {
  vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vO;
    void main(){ vec4 w=modelMatrix*vec4(position,1.); vN=normalize(mat3(modelMatrix)*normal); vV=normalize(cameraPosition-w.xyz); vO=position; gl_Position=projectionMatrix*viewMatrix*w; }`,
  fragmentShader: `uniform float uTime,uFade; varying vec3 vN; varying vec3 vV; varying vec3 vO;
    vec3 env(vec3 d){ float y=d.y*.5+.5; vec3 c=mix(vec3(.06,.09,.13),vec3(.62,.76,.88),pow(y,2.)); c+=vec3(1.4,.8,.36)*pow(max(dot(d,normalize(vec3(.2,-.25,.5))),0.),5.); c+=vec3(.9,1.,1.1)*smoothstep(.72,.98,sin(d.x*7.+d.y*11.+uTime*.25)*.5+.5)*.3; return c; }
    void main(){ vec3 N=normalize(vN),V=normalize(vV); float f=pow(1.-max(dot(N,V),0.),2.6);
      vec3 rR=refract(-V,N,1./1.28),rG=refract(-V,N,1./1.33),rB=refract(-V,N,1./1.39);
      vec3 re=vec3(env(rR).r,env(rG).g,env(rB).b); vec3 rf=env(reflect(-V,N));
      vec3 inner=vec3(1.8,.92,.36)*pow(max(1.-length(vO)/2.4,0.),3.)*.72;
      gl_FragColor=vec4(mix(re,rf,f)*1.05+inner+f*vec3(.5,.62,.75),uFade*(.72+f*.28)); }`,
};

export const particleShader = {
  vertexShader: `attribute vec3 aA,aB; attribute float aR; uniform float uTime,uA,uB,uPx; varying float vE; varying float vR;
    void main(){ float da=smoothstep(aR*.45,aR*.45+.55,uA), db=smoothstep(aR*.45,aR*.45+.55,uB);
      vec3 p=mix(mix(position,aA,da),aB,db);
      float m=sin(da*3.1416)+sin(db*3.1416); vE=m; vR=aR;
      p+=vec3(sin(uTime*.7+aR*40.),cos(uTime*.6+aR*70.),sin(uTime*.5+aR*90.))*(.025+m*.55);
      vec4 mv=viewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv;
      gl_PointSize=(.7+aR*1.3+m*1.1)*uPx*(26./-mv.z); }`,
  fragmentShader: `uniform float uShow; varying float vE; varying float vR;
    void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,.08,d);
      vec3 cold=vec3(.62,.8,1.),warm=vec3(1.,.66,.3); vec3 c=mix(cold,warm,clamp(vE*.9+vR*.25-.1,0.,1.));
      gl_FragColor=vec4(c*(1.+vE*.9),a*uShow*(.045+vE*.05)); }`,
};
