setcpm(90/4)

let cc = await midin()

chacarera:
  stack(
    s("rim*4")
      .room(sine.rangex(.1, .25).slow(irand(8).add(1)))
      .lp(sine.range(2000, 3000).slow(irand(8).add(1)))
      .gain("<1.2!8 1.5!8>"),
    s("bd(2, 3, 1)*2")
      .room(sine.rangex(.05, .25).slow(irand(8).add(1)))
      .lp(sine.rangex(200, 500).slow(irand(8).add(1))), 
   s("cp(2, 3, 2)*4")
      .mask("<0!8 1!8>")
      .room(sine.rangex(.05, .2).slow(irand(8).add(1)))
      .lp(sine.rangex(3000, 3500).slow(irand(8).add(1)))
  )
  .bank("hr16")
  .gain(cc(0).range(0, 1))
  // ._punchcard()

cumbia:
  stack(
    s("bd*4")
      .room(sine.rangex(.05, .1).slow(irand(8).add(1))),
    s("cp(3, 8, 2)*4")
      .room(sine.rangex(.05, .1).slow(irand(8).add(1))),
  )
  .bank("tr505")
  .gain(cc(1).range(0, 1))
  // ._punchcard()

reggaeton:
  stack(
    s("bd*4"),
    s("sd(3, 8)*2").mask("1(7, 8, 1)*2"),
    s("<[hh?0.1|hh?0.2]*8 [hh?0.1|hh?0.25]*[2|16|24]>")
  )
  .bank("tr909")
  .gain(cc(2).rangex(0, 1))
  // ._punchcard()

candombe:
  stack(
    s("bd*4"),
    s("cp(5, 16)?0.1"),
    s("[hh?0.1|hh?0.2](3, 4, 1)*[4|4|3|6]").mask("<1(3, 4, 1)>"),
    s("cr(1, 4, 4)"),
  )
    .bank("r8")
    .gain(cc(3).range(0, 1))
    // ._punchcard()
