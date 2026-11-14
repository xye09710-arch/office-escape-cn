const data = [
  {
    "id": "s0-0",
    "stage": 0,
    "title": "五点整，群消息响了",
    "text": "老板在群里问：“今天的进度呢？”输入框上面已经出现三个“正在输入”。",
    "options": [
      {
        "label": "发一份带链接的进度清单",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary", "evidence"
        ]
      },
      {
        "label": "先做完再回复",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "问小林借汇总模板",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally", "slack"
        ]
      }
    ]
  },
  {
    "id": "s0-1",
    "stage": 0,
    "title": "表格差了两行",
    "text": "离提交只差两行数据，来源系统却开始转圈。小周探头：“要不先估一个？”",
    "options": [
      {
        "label": "保留空值并注明原因",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "等系统恢复再核对",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请小陈帮忙导出",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s0-2",
    "stage": 0,
    "title": "谁的锅先飞过来",
    "text": "群里有人说接口没交，附件上明明写着昨天的日期。",
    "options": [
      {
        "label": "贴出交付时间和回执",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "先接下来补一版",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "私聊对齐再澄清",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s0-3",
    "stage": 0,
    "title": "茶水间的三分钟",
    "text": "小林捧着空杯子问你：“今晚还准备住公司啊？”",
    "options": [
      {
        "label": "顺便打听领导安排",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "回座位把尾项清掉",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "认真休息三分钟",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "slack"
        ]
      }
    ]
  },
  {
    "id": "s0-4",
    "stage": 0,
    "title": "周报里的一个字",
    "text": "老板把“完成”改成“基本完成”，又问你这两个词有什么区别。",
    "options": [
      {
        "label": "附上验收标准",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "按他的意思再润色",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "问清楚还有哪项没过",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s0-5",
    "stage": 0,
    "title": "打印机卡住了",
    "text": "行政急着要签字页，打印机却把纸嚼成了手风琴。",
    "options": [
      {
        "label": "找电子签替代方案",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "拆开纸盒慢慢处理",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "喊熟悉设备的小陈帮忙",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "slack"
        ]
      }
    ]
  },
  {
    "id": "s0-6",
    "stage": 0,
    "title": "桌面上的十七个文件",
    "text": "最终版、最终版二、真最终版挤在同一个文件夹里。",
    "options": [
      {
        "label": "整理版本并发固定链接",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "直接打开最新修改的文件",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请同事确认正确版本",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s0-7",
    "stage": 0,
    "title": "外卖红包快过期",
    "text": "小周摇着手机：“先点晚饭？满减还差一个人。”",
    "options": [
      {
        "label": "说好今晚回家吃",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "先把进度赶完再说",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "陪他凑单顺便聊聊",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "boundary-0",
    "stage": 0,
    "route": "boundary",
    "title": "边界感：说清楚截止时间",
    "text": "你前面留下的选择有了回音。老板记得你说过的下班安排：“那这个今天到底能做多少？”",
    "options": [
      {
        "label": "按约定范围交付",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "boundaryDone"
        ]
      },
      {
        "label": "临时扩大工作范围",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "找同事一起确认范围",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "evidence-0",
    "stage": 0,
    "route": "evidence",
    "title": "证据链：记录比嗓门管用",
    "text": "你前面留下的选择有了回音。有人翻到了你保存的记录：“还好当时留了这一手。”",
    "options": [
      {
        "label": "把记录发到共享文档",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "evidenceDone"
        ]
      },
      {
        "label": "重新做一份详细材料",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请当事人共同确认",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "ally-0",
    "stage": 0,
    "route": "ally",
    "title": "人情账：有人记得你帮过忙",
    "text": "你前面留下的选择有了回音。小林把椅子挪过来：“上次你帮过我，这次我来搭把手。”",
    "options": [
      {
        "label": "和同事平分剩余任务",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "allyDone"
        ]
      },
      {
        "label": "自己扛下全部收尾",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "约定互相代班",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "slack-0",
    "stage": 0,
    "route": "slack",
    "title": "摸鱼线：消息免打扰之后",
    "text": "你前面留下的选择有了回音。你没回的消息已经攒成一屏。小周压低声音：“领导刚才找你了。”",
    "options": [
      {
        "label": "恢复在线并交代进度",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "slackDone"
        ]
      },
      {
        "label": "继续躲开群消息",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "找同事打听风向",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "hero-0",
    "stage": 0,
    "route": "hero",
    "title": "硬扛线：办公室的万能补位",
    "text": "你前面留下的选择有了回音。大家开始习惯把急活递给你：“这个你最熟，帮忙顶一下。”",
    "options": [
      {
        "label": "只接最关键的一项",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "heroDone"
        ]
      },
      {
        "label": "全部接下再说",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请大家一起拆任务",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s1-0",
    "stage": 1,
    "title": "老板说就改一页",
    "text": "“这页颜色不够有冲击力。”你看了一眼，已经改到第六版。",
    "options": [
      {
        "label": "确认本次修改范围",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "把整套配色重做一遍",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "找小林一起挑一版",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s1-1",
    "stage": 1,
    "title": "工作群突然点名",
    "text": "手机震了三下：“@你 这个谁跟？”下面还有一个问号。",
    "options": [
      {
        "label": "发责任人与交付节点",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "回一句我来处理",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "先找实际负责人确认",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s1-2",
    "stage": 1,
    "title": "五点半的临时会",
    "text": "会议邀请写着十分钟，附件却有四十二页。",
    "options": [
      {
        "label": "要求先列必须决策的事项",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "带电脑边听边做",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "帮大家提前汇总问题",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s1-3",
    "stage": 1,
    "title": "同事递来的急活",
    "text": "小陈说：“你顺手帮我看一眼？真的就一眼。”表格有八个工作表。",
    "options": [
      {
        "label": "只检查最关键的一列",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "从头到尾替他核一遍",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "交换任务，让他补你的数据",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "slack"
        ]
      }
    ]
  },
  {
    "id": "s1-4",
    "stage": 1,
    "title": "需求又换了个说法",
    "text": "上午要简洁，下午要丰富，现在要“简洁但有层次”。",
    "options": [
      {
        "label": "拿两版让老板当场选",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "再做一版折中方案",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "找需求方一起确认",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s1-5",
    "stage": 1,
    "title": "消息撤回了",
    "text": "领导发来一段话又撤回。你只看见了“今晚”。",
    "options": [
      {
        "label": "问是否有明确待办",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "先把可能要的材料补好",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "装作没看到，歇口气",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "slack"
        ]
      }
    ]
  },
  {
    "id": "s1-6",
    "stage": 1,
    "title": "邮件忘了抄送",
    "text": "合作方回复：“这个需要你们领导确认。”你发现抄送栏空着。",
    "options": [
      {
        "label": "补齐背景再抄送",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "重写一封长邮件解释",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请熟悉对方的同事牵线",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s1-7",
    "stage": 1,
    "title": "共享文档有人在改",
    "text": "光标在你的段落里闪，三句话被改出了四种语气。",
    "options": [
      {
        "label": "锁定已确认段落",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "跟着对方实时调整",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "开个短语音一次说清",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "boundary-1",
    "stage": 1,
    "route": "boundary",
    "title": "边界感：说清楚截止时间",
    "text": "你前面留下的选择有了回音。老板记得你说过的下班安排：“那这个今天到底能做多少？”",
    "options": [
      {
        "label": "按约定范围交付",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "boundaryDone"
        ]
      },
      {
        "label": "临时扩大工作范围",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "找同事一起确认范围",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "evidence-1",
    "stage": 1,
    "route": "evidence",
    "title": "证据链：记录比嗓门管用",
    "text": "你前面留下的选择有了回音。有人翻到了你保存的记录：“还好当时留了这一手。”",
    "options": [
      {
        "label": "把记录发到共享文档",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "evidenceDone"
        ]
      },
      {
        "label": "重新做一份详细材料",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请当事人共同确认",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "ally-1",
    "stage": 1,
    "route": "ally",
    "title": "人情账：有人记得你帮过忙",
    "text": "你前面留下的选择有了回音。小林把椅子挪过来：“上次你帮过我，这次我来搭把手。”",
    "options": [
      {
        "label": "和同事平分剩余任务",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "allyDone"
        ]
      },
      {
        "label": "自己扛下全部收尾",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "约定互相代班",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "slack-1",
    "stage": 1,
    "route": "slack",
    "title": "摸鱼线：消息免打扰之后",
    "text": "你前面留下的选择有了回音。你没回的消息已经攒成一屏。小周压低声音：“领导刚才找你了。”",
    "options": [
      {
        "label": "恢复在线并交代进度",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "slackDone"
        ]
      },
      {
        "label": "继续躲开群消息",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "找同事打听风向",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "hero-1",
    "stage": 1,
    "route": "hero",
    "title": "硬扛线：办公室的万能补位",
    "text": "你前面留下的选择有了回音。大家开始习惯把急活递给你：“这个你最熟，帮忙顶一下。”",
    "options": [
      {
        "label": "只接最关键的一项",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "heroDone"
        ]
      },
      {
        "label": "全部接下再说",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请大家一起拆任务",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s2-0",
    "stage": 2,
    "title": "做完了，还能走吗",
    "text": "任务栏已经清空，办公室却没人动。有人把椅子往后挪，又坐回去了。",
    "options": [
      {
        "label": "公开同步已完成并说明下线",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "再检查一遍全部文件",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "问同事要不要一起走",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s2-1",
    "stage": 2,
    "title": "老板路过工位",
    "text": "他看着你关掉的文档：“这么早就忙完啦？”",
    "options": [
      {
        "label": "展示验收清单",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "赶紧打开文件继续改",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "笑着介绍大家今天的成果",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s2-2",
    "stage": 2,
    "title": "最后一个小问题",
    "text": "测试同事发来截图：“这是不是有点不对？”红框圈在一个标点上。",
    "options": [
      {
        "label": "确认是否影响今天交付",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "直接把相关页面全查一遍",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请他一起复核关键路径",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s2-3",
    "stage": 2,
    "title": "锅又转回来了",
    "text": "上午没参加讨论的人说：“当时不是你答应的吗？”",
    "options": [
      {
        "label": "翻出会议记录对照",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "先补上缺口以后再说",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "拉相关同事一起还原",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "slack"
        ]
      }
    ]
  },
  {
    "id": "s2-4",
    "stage": 2,
    "title": "六点前的知识分享",
    "text": "小周突然开始讲新工具，投影仪还在自动更新。",
    "options": [
      {
        "label": "约明天正式分享",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "留下听完顺便做笔记",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "帮他整理成群里的短消息",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s2-5",
    "stage": 2,
    "title": "领导要一个数字",
    "text": "“不用很准，马上给我。”你知道这个数字明天会出现在汇报里。",
    "options": [
      {
        "label": "给范围并注明口径",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "加班算出精确值",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "问数据同事交叉核验",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "slack"
        ]
      }
    ]
  },
  {
    "id": "s2-6",
    "stage": 2,
    "title": "电梯前的群通知",
    "text": "你刚站起来，群里弹出“所有人确认收到”。",
    "options": [
      {
        "label": "确认无待办后回复",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "重新坐下翻全部消息",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "提醒同事一起确认",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s2-7",
    "stage": 2,
    "title": "没人认领的收尾",
    "text": "公共看板上剩着一个没有负责人的小框，所有人都假装没看见。",
    "options": [
      {
        "label": "标明归属并约定明天处理",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "自己把它清掉",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "拉同事分掉最后一点",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "boundary-2",
    "stage": 2,
    "route": "boundary",
    "title": "边界感：说清楚截止时间",
    "text": "你前面留下的选择有了回音。老板记得你说过的下班安排：“那这个今天到底能做多少？”",
    "options": [
      {
        "label": "按约定范围交付",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "boundaryDone"
        ]
      },
      {
        "label": "临时扩大工作范围",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "找同事一起确认范围",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "evidence-2",
    "stage": 2,
    "route": "evidence",
    "title": "证据链：记录比嗓门管用",
    "text": "你前面留下的选择有了回音。有人翻到了你保存的记录：“还好当时留了这一手。”",
    "options": [
      {
        "label": "把记录发到共享文档",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "evidenceDone"
        ]
      },
      {
        "label": "重新做一份详细材料",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请当事人共同确认",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "ally-2",
    "stage": 2,
    "route": "ally",
    "title": "人情账：有人记得你帮过忙",
    "text": "你前面留下的选择有了回音。小林把椅子挪过来：“上次你帮过我，这次我来搭把手。”",
    "options": [
      {
        "label": "和同事平分剩余任务",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "allyDone"
        ]
      },
      {
        "label": "自己扛下全部收尾",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "约定互相代班",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "slack-2",
    "stage": 2,
    "route": "slack",
    "title": "摸鱼线：消息免打扰之后",
    "text": "你前面留下的选择有了回音。你没回的消息已经攒成一屏。小周压低声音：“领导刚才找你了。”",
    "options": [
      {
        "label": "恢复在线并交代进度",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "slackDone"
        ]
      },
      {
        "label": "继续躲开群消息",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "找同事打听风向",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "hero-2",
    "stage": 2,
    "route": "hero",
    "title": "硬扛线：办公室的万能补位",
    "text": "你前面留下的选择有了回音。大家开始习惯把急活递给你：“这个你最熟，帮忙顶一下。”",
    "options": [
      {
        "label": "只接最关键的一项",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "heroDone"
        ]
      },
      {
        "label": "全部接下再说",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请大家一起拆任务",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s3-0",
    "stage": 3,
    "title": "电脑已经关了",
    "text": "屏幕刚黑，老板叫住你：“等等，那个文件在哪？”",
    "options": [
      {
        "label": "发固定链接和交接说明",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "重新开机现场找",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请还在线的同事转发",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s3-1",
    "stage": 3,
    "title": "门禁卡找不到了",
    "text": "包翻了两遍，卡躺在键盘下面。老板还在走廊接电话。",
    "options": [
      {
        "label": "拿卡正常道别",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "等走廊没人再出去",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "叫同事一起去电梯",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s3-2",
    "stage": 3,
    "title": "最后一次确认",
    "text": "合作方问：“今晚还能支持一下吗？”没有说具体事情。",
    "options": [
      {
        "label": "约定支持范围和最晚时间",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "承诺今晚一直在线",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "留好同事的交接联系人",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s3-3",
    "stage": 3,
    "title": "电梯门开了",
    "text": "电梯就在眼前，手机却又亮了。消息开头是“方便吗”。",
    "options": [
      {
        "label": "先问具体事项和截止时间",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "回座位打电话细聊",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请对方先发文档链接",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "slack"
        ]
      }
    ]
  },
  {
    "id": "s3-4",
    "stage": 3,
    "title": "打卡前的一分钟",
    "text": "小周正在群里发“辛苦大家”，你只想先到地铁站。",
    "options": [
      {
        "label": "发完成清单然后打卡",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "补一段长长的工作总结",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "给帮过忙的同事道声谢",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s3-5",
    "stage": 3,
    "title": "明天的待办来了",
    "text": "老板说：“记一下，明天一早要。”这次他真的说了明天。",
    "options": [
      {
        "label": "记入明日清单安心离开",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "今晚先做一半才放心",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "和同事约好明早分工",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "slack"
        ]
      }
    ]
  },
  {
    "id": "s3-6",
    "stage": 3,
    "title": "文件权限没开",
    "text": "刚准备走，对方说链接打不开。",
    "options": [
      {
        "label": "只修正权限并确认收到",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "boundary"
        ]
      },
      {
        "label": "把所有文件重新打包",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "找同事帮忙测试权限",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "s3-7",
    "stage": 3,
    "title": "办公室最后一盏灯",
    "text": "保洁阿姨推着车过来：“你们今天又不走啊？”",
    "options": [
      {
        "label": "确认交接后直接下班",
        "hint": "用沟通换确定性，进度推进较慢",
        "effect": {
          "time": 3,
          "work": 5,
          "suspicion": -5,
          "fatigue": 1
        },
        "flags": [
          "evidence"
        ]
      },
      {
        "label": "再检查一圈工位",
        "hint": "工作推进较多，但会更累、更晚",
        "effect": {
          "time": 6,
          "work": 10,
          "suspicion": -2,
          "fatigue": 7,
          "relation": -2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "帮同事收尾一起关灯",
        "hint": "维护人情或争取喘息，交付少一些",
        "effect": {
          "time": 2,
          "work": 2,
          "relation": 8,
          "suspicion": 4,
          "fatigue": -3
        },
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "boundary-3",
    "stage": 3,
    "route": "boundary",
    "title": "边界感：说清楚截止时间",
    "text": "你前面留下的选择有了回音。老板记得你说过的下班安排：“那这个今天到底能做多少？”",
    "options": [
      {
        "label": "按约定范围交付",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "boundaryDone"
        ]
      },
      {
        "label": "临时扩大工作范围",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "找同事一起确认范围",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "evidence-3",
    "stage": 3,
    "route": "evidence",
    "title": "证据链：记录比嗓门管用",
    "text": "你前面留下的选择有了回音。有人翻到了你保存的记录：“还好当时留了这一手。”",
    "options": [
      {
        "label": "把记录发到共享文档",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "evidenceDone"
        ]
      },
      {
        "label": "重新做一份详细材料",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请当事人共同确认",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "ally-3",
    "stage": 3,
    "route": "ally",
    "title": "人情账：有人记得你帮过忙",
    "text": "你前面留下的选择有了回音。小林把椅子挪过来：“上次你帮过我，这次我来搭把手。”",
    "options": [
      {
        "label": "和同事平分剩余任务",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "allyDone"
        ]
      },
      {
        "label": "自己扛下全部收尾",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "约定互相代班",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "slack-3",
    "stage": 3,
    "route": "slack",
    "title": "摸鱼线：消息免打扰之后",
    "text": "你前面留下的选择有了回音。你没回的消息已经攒成一屏。小周压低声音：“领导刚才找你了。”",
    "options": [
      {
        "label": "恢复在线并交代进度",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "slackDone"
        ]
      },
      {
        "label": "继续躲开群消息",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "找同事打听风向",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "hero-3",
    "stage": 3,
    "route": "hero",
    "title": "硬扛线：办公室的万能补位",
    "text": "你前面留下的选择有了回音。大家开始习惯把急活递给你：“这个你最熟，帮忙顶一下。”",
    "options": [
      {
        "label": "只接最关键的一项",
        "hint": "兑现之前的选择",
        "effect": {
          "time": 2,
          "work": 6,
          "suspicion": -4,
          "relation": 2
        },
        "flags": [
          "heroDone"
        ]
      },
      {
        "label": "全部接下再说",
        "hint": "多做一点，代价是时间和体力",
        "effect": {
          "time": 7,
          "work": 12,
          "fatigue": 9,
          "suspicion": 2
        },
        "flags": [
          "hero"
        ]
      },
      {
        "label": "请大家一起拆任务",
        "hint": "需要与同事积累一定默契",
        "effect": {
          "time": 1,
          "work": 7,
          "relation": -3,
          "suspicion": -3
        },
        "requireKey": "relation",
        "threshold": 50,
        "locked": "同事关系达到50",
        "flags": [
          "ally"
        ]
      }
    ]
  },
  {
    "id": "hidden-0",
    "stage": 0,
    "route": "evidence",
    "hidden": true,
    "title": "回执里的时间戳",
    "text": "旧邮件的回执替你证明：文件昨天就交了。",
    "options": [
      {
        "label": "把这个机会用在收尾上",
        "hint": "加快交付",
        "effect": {
          "time": 1,
          "work": 10,
          "suspicion": -4
        },
        "flags": [
          "secret"
        ]
      },
      {
        "label": "记下经验，下次少绕弯",
        "hint": "喘口气，减少疲劳",
        "effect": {
          "time": 2,
          "fatigue": -12
        },
        "flags": [
          "secret"
        ]
      },
      {
        "label": "把好消息告诉同事",
        "hint": "关系更进一步",
        "effect": {
          "time": 2,
          "relation": 12
        },
        "flags": [
          "secret"
        ]
      }
    ]
  },
  {
    "id": "hidden-1",
    "stage": 1,
    "route": "ally",
    "hidden": true,
    "title": "抽屉里的救急数据",
    "text": "小林翻出一份备份：“别声张，先拿去用。”",
    "options": [
      {
        "label": "把这个机会用在收尾上",
        "hint": "加快交付",
        "effect": {
          "time": 1,
          "work": 10,
          "suspicion": -4
        },
        "flags": [
          "secret"
        ]
      },
      {
        "label": "记下经验，下次少绕弯",
        "hint": "喘口气，减少疲劳",
        "effect": {
          "time": 2,
          "fatigue": -12
        },
        "flags": [
          "secret"
        ]
      },
      {
        "label": "把好消息告诉同事",
        "hint": "关系更进一步",
        "effect": {
          "time": 2,
          "relation": 12
        },
        "flags": [
          "secret"
        ]
      }
    ]
  },
  {
    "id": "hidden-2",
    "stage": 1,
    "route": "boundary",
    "hidden": true,
    "title": "取消的会议",
    "text": "你提前列的问题已经有了答案。老板说：“那今天不开了。”",
    "options": [
      {
        "label": "把这个机会用在收尾上",
        "hint": "加快交付",
        "effect": {
          "time": 1,
          "work": 10,
          "suspicion": -4
        },
        "flags": [
          "secret"
        ]
      },
      {
        "label": "记下经验，下次少绕弯",
        "hint": "喘口气，减少疲劳",
        "effect": {
          "time": 2,
          "fatigue": -12
        },
        "flags": [
          "secret"
        ]
      },
      {
        "label": "把好消息告诉同事",
        "hint": "关系更进一步",
        "effect": {
          "time": 2,
          "relation": 12
        },
        "flags": [
          "secret"
        ]
      }
    ]
  },
  {
    "id": "hidden-3",
    "stage": 2,
    "route": "slack",
    "hidden": true,
    "title": "茶水间听来的真话",
    "text": "你听见领导在打电话：“我也想早点回家。”",
    "options": [
      {
        "label": "把这个机会用在收尾上",
        "hint": "加快交付",
        "effect": {
          "time": 1,
          "work": 10,
          "suspicion": -4
        },
        "flags": [
          "secret"
        ]
      },
      {
        "label": "记下经验，下次少绕弯",
        "hint": "喘口气，减少疲劳",
        "effect": {
          "time": 2,
          "fatigue": -12
        },
        "flags": [
          "secret"
        ]
      },
      {
        "label": "把好消息告诉同事",
        "hint": "关系更进一步",
        "effect": {
          "time": 2,
          "relation": 12
        },
        "flags": [
          "secret"
        ]
      }
    ]
  },
  {
    "id": "hidden-4",
    "stage": 3,
    "route": "hero",
    "hidden": true,
    "title": "领导的最后一句",
    "text": "你以为又有新活，他却说：“别做了，明天再来。”",
    "options": [
      {
        "label": "把这个机会用在收尾上",
        "hint": "加快交付",
        "effect": {
          "time": 1,
          "work": 10,
          "suspicion": -4
        },
        "flags": [
          "secret"
        ]
      },
      {
        "label": "记下经验，下次少绕弯",
        "hint": "喘口气，减少疲劳",
        "effect": {
          "time": 2,
          "fatigue": -12
        },
        "flags": [
          "secret"
        ]
      },
      {
        "label": "把好消息告诉同事",
        "hint": "关系更进一步",
        "effect": {
          "time": 2,
          "relation": 12
        },
        "flags": [
          "secret"
        ]
      }
    ]
  }
];
export const events=data.map(e=>({...e,when:e.route ? s=>s.flags.includes(e.route) : undefined,options:e.options.map(o=>({...o,require:o.requireKey ? s=>s[o.requireKey]>=o.threshold : undefined}))}));
