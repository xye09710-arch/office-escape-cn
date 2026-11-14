export const DIFFICULTIES={easy:{name:'简单',note:'任务少一点，同事好说话',time:0,work:1,suspicion:-1,fatigue:-1,delay:0},normal:{name:'普通',note:'熟悉的工作日，熟悉的临时需求',time:0,work:0,suspicion:0,fatigue:0,delay:4},hard:{name:'困难',note:'沟通成本增加，领导盯得更紧',time:1,work:0,suspicion:2,fatigue:1,delay:9},hell:{name:'地狱',note:'每件事都很急，精力掉得更快',time:2,work:-1,suspicion:3,fatigue:2,delay:15}};
export const ENDINGS={ontime:{name:'准点下班，理直气壮',text:'交付有凭据，交接有人接。你按下电梯，今晚的第一口饭终于不用对着电脑吃。'},team:{name:'组队撤离成功',text:'你们互相补过的坑，变成了今天一起离开的底气。电梯里没有人再问“还有事吗”。'},late:{name:'晚了一点，也算赢',text:'临时需求多绕了几圈，你还是把工作留在了工位上。街边的煎饼摊还没收。'},caught:{name:'门口被叫回',text:'“你等一下。”熟悉的声音在身后响起。没说清的消息，最后都变成了返工。'},unfinished:{name:'尾款是加班',text:'人差点走了，任务还没走。欠下的收尾不会凭空消失，只好再打开那张表。'},burnout:{name:'工位续费成功',text:'你接住了所有人的急活，却没给自己留电量。屏幕还亮着，脑子已经开始转圈。'}};
export function outcome(s){
 if(s.turn!==18) throw new Error('完成十八次决策后才能结算');
 const extra=Math.ceil(Math.max(0,85-s.work)*1.4)+Math.ceil(Math.max(0,s.suspicion-45)*.8)+Math.ceil(Math.max(0,s.fatigue-65)*.5);
 const time=s.time+extra;
 const id=s.fatigue>=85?'burnout':s.work<70?'unfinished':s.suspicion>=65?'caught':s.relation>=80?'team':time<=1080?'ontime':'late';
 const d=DIFFICULTIES[s.difficulty];
 const coworkers=[{name:'小林',personality:'热心搭子',time:1083+d.delay-Math.floor(s.relation/12)+(s.flags.includes('allyDone')?-5:4)},{name:'小周',personality:'踩点达人',time:1075+d.delay+(s.flags.includes('slack')?5:0)},{name:'小陈',personality:'细节控',time:1100+d.delay+(s.work<70?8:-4)},{name:'老王',personality:'稳稳收尾',time:1090+d.delay+(s.flags.includes('evidenceDone')?-8:5)}];
 const ranking=[{name:'你',personality:'今天也辛苦了',time,player:true},...coworkers].sort((a,b)=>a.time-b.time).map((p,i,all)=>({...p,rank:all.findIndex(x=>x.time===p.time)+1}));
 return {id,...ENDINGS[id],time,extra,ranking,rank:ranking.find(p=>p.player).rank};
}
