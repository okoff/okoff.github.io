function plan(plan, wc_ans, sort) {
	let pl = plan.map( function(e) { return e.PL; });
	let ql = plan.map( function(e) { return e.Q; });
	let sc = [];
	console.log(pl);
	
	function sort1(a, b){
		if (a.PL < b.PL) {return -1;}
		if (a.PL > b.PL) {return 1;}
		if (a.P  < b.P)  {return -1;} // цена
		if (a.P  > b.P)  {return 1;}
		if (a.D  < b.D)  {return -1;} // качество
		if (a.D  > b.D)  {return 1;}
		if (a.T  < b.T)  {return -1;} // время
		if (a.T  > b.T)  {return 1;}
        return 0;
	}
	
	wc_ans.sort(sort1);
  
	for (let row of wc_ans) {
		//console.log(row);
		let ix = pl.indexOf(row.PL);
		//console.log("ix=" + ix + " PL=" + plan[ix].PL + " Q=" + plan[ix].Q);
		if (row.Q>0 & ql[ix]>0) {
			ql[ix] = ql[ix] - row.Q;
			sc.push(row);
			//console.log("PL=" + plan[ix].PL + " Q=" + plan[ix].Q + " last=" + ql[ix]);
		}
	};
	
	let cx = -1;
	let p = [];
	for (let row of sc) {
		let ix = pl.indexOf(row.PL);
		//console.log("ix=" + ix + " cx=" + cx);
		if (ix != cx) {
			cx = ix;
			p[ix] = {"pct":0, "sum":0, "def":0, "eff":0};
		}
		p[ix].pct += row.Q / plan[ix].Q;
		p[ix].sum += row.Q * row.P;
		p[ix].def += (row.D / 100 / row.Q) * row.P;
		p[ix].eff += (row.Q * row.P) / row.T;
	}
	let m = 0, s = 0, d = 0, e = 0;
	for (let row of p) {
		console.log("p=" + row.pct + " s=" + row.sum + " d=" + row.def + " e=" + row.eff);
		m = m + row.pct;
		s = s + row.sum;
		d = d + row.def;
		e = e + row.eff;
	}
	console.log("total:\nexpence=$" + s + " loss=$" + d + " flow=$" + e + "/sec");
		
    return sc;
}