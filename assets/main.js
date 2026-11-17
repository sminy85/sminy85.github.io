// Squat-depth demo: a side-view skeleton whose hip keypoint is compared with the
// knee keypoint, the same rule the posture-analysis prototype applies per frame.
(function () {
  var slider = document.getElementById('depth');
  if (!slider) return;

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    shin: $('b-shin'), thigh: $('b-thigh'), torso: $('b-torso'),
    knee: $('k-knee'), hip: $('k-hip'), shoulder: $('k-shoulder'),
    head: $('head'), plate: $('plate'), hub: $('platehub'),
    kneeline: $('kneeline'), kneelabel: $('kneelabel'), hiplabel: $('hiplabel'),
    verdict: $('verdict'), rHip: $('r-hip'), rKnee: $('r-knee')
  };

  var H = 300;                       // viewBox height, for normalised y
  var ANKLE = { x: 160, y: 256 };
  var SHIN = 62, THIGH = 64, TORSO = 72, NECK = 17;
  var TOLERANCE = 3;                 // px of slack around "hip level with knee"
  var rad = function (d) { return d * Math.PI / 180; };

  function line(node, a, b) {
    node.setAttribute('x1', a.x); node.setAttribute('y1', a.y);
    node.setAttribute('x2', b.x); node.setAttribute('y2', b.y);
  }
  function at(node, p) { node.setAttribute('cx', p.x); node.setAttribute('cy', p.y); }

  function render(t) {
    var shinA = rad(4 + 30 * t);     // shin leans forward
    var thighA = rad(4 + 106 * t);   // thigh swings back, past horizontal near the bottom
    var torsoA = rad(4 + 40 * t);    // torso leans forward to stay balanced

    var knee = { x: ANKLE.x + SHIN * Math.sin(shinA), y: ANKLE.y - SHIN * Math.cos(shinA) };
    var hip = { x: knee.x - THIGH * Math.sin(thighA), y: knee.y - THIGH * Math.cos(thighA) };
    var shoulder = { x: hip.x + TORSO * Math.sin(torsoA), y: hip.y - TORSO * Math.cos(torsoA) };
    var head = {
      x: shoulder.x + NECK * Math.sin(torsoA) + 5 * Math.cos(torsoA),
      y: shoulder.y - NECK * Math.cos(torsoA) + 5 * Math.sin(torsoA)
    };
    // bar rests on the upper back: just behind the shoulder, perpendicular to the torso
    var bar = { x: shoulder.x - 10 * Math.cos(torsoA), y: shoulder.y - 10 * Math.sin(torsoA) };

    line(el.shin, ANKLE, knee);
    line(el.thigh, knee, hip);
    line(el.torso, hip, shoulder);
    at(el.knee, knee); at(el.hip, hip); at(el.shoulder, shoulder);
    at(el.head, head); at(el.plate, bar); at(el.hub, bar);

    el.kneeline.setAttribute('y1', knee.y); el.kneeline.setAttribute('y2', knee.y);
    el.kneelabel.setAttribute('y', knee.y - 5);
    el.hiplabel.setAttribute('x', hip.x - 13);
    el.hiplabel.setAttribute('y', hip.y + 4);

    // image coordinates: y grows downward, so a deeper hip has a larger y
    var good = hip.y >= knee.y - TOLERANCE;
    el.hip.classList.toggle('good', good);
    el.hiplabel.classList.toggle('good', good);
    el.verdict.classList.toggle('good', good);
    var msg = good ? '좋은 깊이예요' : '더 깊이 앉으세요';
    if (el.verdict.textContent !== msg) el.verdict.textContent = msg;
    el.rHip.textContent = (hip.y / H).toFixed(2);
    el.rKnee.textContent = (knee.y / H).toFixed(2);
  }

  var auto = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var start = null;

  function stopAuto() { auto = false; }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    slider.addEventListener(ev, stopAuto, { passive: true });
  });
  slider.addEventListener('input', function () {
    render(slider.value / 100);
  });

  function tick(now) {
    if (!auto) return;
    if (start === null) start = now;
    var t = 0.5 - 0.5 * Math.cos((now - start) / 5000 * 2 * Math.PI);
    slider.value = Math.round(t * 100);
    render(t);
    requestAnimationFrame(tick);
  }

  render(slider.value / 100);
  if (auto) requestAnimationFrame(tick);
})();
