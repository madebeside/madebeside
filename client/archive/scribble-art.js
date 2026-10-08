export const blobKinds=['arch','joined','bend','frame','aperture','conversation','spark','arrow'];
export function blobDensity(u,v,phase,kind='arch'){
 const x=u+Math.sin(v*5+phase)*.025,y=v+Math.sin(u*4-phase)*.025;
 const ring=(cx,cy,rx,ry)=>Math.abs(Math.hypot((x-cx)/rx,(y-cy)/ry)-1)*Math.min(rx,ry);
 let d;
 switch(kind){
 case 'joined':d=Math.min(ring(-.19,0,.23,.32),ring(.19,0,.23,.32));break;
 case 'bend':d=Math.min(y<0?ring(.08,.05,.32,.32):Math.abs(x+.24),x>0?Math.abs(y+.27):1);break;
 case 'frame':{const q=Math.max(Math.abs(x)-.32,Math.abs(y)-.25);d=Math.abs(q);break;}
 case 'aperture':d=Math.abs(Math.hypot(x,y)-(.27+.045*Math.cos(Math.atan2(y,x)*6+phase*.12)));break;
 case 'conversation':d=Math.min(ring(-.13,-.08,.25,.19),ring(.19,.16,.22,.17));break;
 case 'spark':d=Math.abs(Math.hypot(x,y)-(.23+.09*Math.cos(Math.atan2(y,x)*4)));break;
 case 'arrow':d=Math.min(Math.abs(y-x)*.7,Math.hypot(Math.max(0,Math.abs(x-.12)-.2),y+.24),Math.hypot(x-.32,Math.max(0,Math.abs(y+.04)-.2)));break;
 default:d=Math.min(y<0?ring(0,.06,.31,.34):Math.min(Math.abs(x-.31),Math.abs(x+.31)),1);
 }
 return Math.max(.025,Math.min(.97,.08+Math.exp(-d*23)*.82));
}
export function iconForTopic(topic=''){
 const t=topic.toLowerCase();
 if(/channel/.test(t))return 'network';
 if(/audience/.test(t))return 'search';
 if(/themes|formats/.test(t))return 'pencil';
 if(/digital marketing/.test(t))return 'megaphone';
 if(/listen|conversation|community|social media|touch|know the business/.test(t))return 'conversation';
 if(/photograph/.test(t))return 'camera';
 if(/video|production|capture|work/.test(t))return 'film';
 if(/edit|cutdown|detail|shape and deliver/.test(t))return 'edit';
 if(/report|review|learn|measure/.test(t))return 'chart';
 if(/calendar|scheduling/.test(t))return 'calendar';
 if(/direction|strategy|brief|plan|audience|message|themes|how we work/.test(t))return 'compass';
 if(/share|publish|campaign|release|placement|format|distribution/.test(t))return 'megaphone';
 if(/together|approach/.test(t))return 'hands';
 return 'pencil';
}
export const scribblePaths={
 search:['M111 42C57 38 30 76 43 120C54 163 112 177 150 145C196 107 162 39 111 42Z','M151 143L215 200L229 184L167 128 M89 65Q56 76 61 111','M84 101L121 98 M102 81L104 121'],
 network:['M38 40L99 37L101 87L40 91Z M160 42L224 40L222 90L161 93Z M98 157L163 155L164 203L99 205Z','M100 65L161 64 M70 91L71 125L130 127L130 156 M193 93L194 127L148 127','M55 57L80 56 M180 59L206 58 M115 175L144 174'],
 film:['M43 77Q40 70 52 71L173 67Q184 68 185 82L182 172Q184 181 171 181L48 184Q38 180 41 166Z','M57 86L166 83L165 164L56 169Z M91 102L91 146L130 123Z','M55 53L163 38L181 62L47 78Z M70 53L87 69 M110 47L125 66 M148 42L165 62','M196 91L225 74L225 160L192 148'],
 camera:['M38 87Q34 78 50 78L78 79L89 59L142 57L154 77L211 75L217 172Q218 185 203 183L46 189Q33 188 36 173Z','M127 96C78 93 77 165 124 169C172 169 176 99 127 96Z','M126 107C94 109 93 150 126 154C157 154 160 109 126 107 M179 92L199 92 M49 62L66 59'],
 conversation:['M31 57Q21 35 55 37L164 35Q191 36 188 62L186 117Q185 131 162 130L78 131L49 155L54 128Q31 129 31 110Z','M81 150L103 174L197 173L224 197L217 174Q239 174 238 155L234 96Q233 82 208 83','M56 69L157 65 M56 87L141 84 M57 105L113 102'],
 edit:['M32 78C22 46 56 31 72 57C88 85 49 104 34 80 M33 162C15 137 51 116 70 137C94 164 53 193 33 162','M67 77L216 176 M70 146L215 42 M107 115L112 111','M152 58L174 42 M158 171L184 185'],
 chart:['M39 35L36 188L229 185','M58 150L93 118L128 136L175 81L221 52 M194 51L223 49L219 79','M68 181L69 162 M110 181L111 149 M155 181L155 122 M201 180L202 102'],
 calendar:['M41 62L219 57L221 191L40 195Z M40 95L219 91','M75 40L76 77 M176 34L176 75','M67 121L87 119 M112 119L131 118 M158 117L182 116 M67 155L87 154 M112 154L135 153 M163 150L179 167L203 134'],
 compass:['M130 27C63 23 22 79 41 143C57 203 140 214 189 175C238 136 214 42 149 28','M151 72L98 106L83 162L139 133Z M98 106L139 133','M127 39L127 56 M127 176L128 191 M45 114L62 114 M191 110L207 108'],
 megaphone:['M46 100L105 84L196 41L202 164L109 132L46 132Z','M78 136L89 193L119 187L110 139 M197 80Q222 85 218 111Q217 127 201 130','M217 48L235 32 M227 69L248 62 M225 146L243 155'],
 hands:['M30 119L61 68L105 78L127 102 M215 119L193 72L157 77L124 102L101 127Q111 145 127 133L150 113','M60 119L96 160L117 174Q126 182 134 170L151 177Q166 182 174 165L187 164L205 139 M123 135L158 161 M109 151L133 170','M28 110L14 137L50 166L68 142 M213 111L241 135L210 171L190 146'],
 pencil:['M63 177L75 133L168 42Q178 32 191 44L210 61Q216 70 205 82L109 173Z','M77 133L109 172 M162 49L197 83 M64 176L95 167 M39 196L204 190','M87 142L176 57']
};
