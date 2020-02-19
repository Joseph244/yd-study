/**
 * @description 编译转换dom为可解析的vdom
 * @param {dom 元素节点} node 
 * @param {vue实例} vm 
 */
function Compile(node, vm) {
  if (node) {
    this.$frag = this.nodeToFragment(node, vm);
    return this.$frag;
  }
}
Compile.prototype = {
  // vdom
  nodeToFragment: function (node, vm) {
    var self = this;
    var frag = document.createDocumentFragment();   // 创建内存中虚拟的文档片段
    var child;
    // 递归获取一层一层的dom节点
    while (child = node.firstChild) {
      console.log('compile',child)
      self.compileElement(child, vm);
      frag.append(child);   // 将所有子节点添加到fragment中
    }
    return frag;
  },
  compileElement: function (node, vm) {
    var reg = /\{\{(.*)\}\}/;

    //节点类型为元素
    if (node.nodeType === 1) {
      var attr = node.attributes;
      // 解析属性
      for (var i = 0; i < attr.length; i++) {
        if (attr[i].nodeName == 'v-model') {
          var name = attr[i].nodeValue; // 获取v-model绑定的属性名
          node.addEventListener('input', function (e) {
            // 给相应的data属性赋值，进而触发该属性的set方法
            //再批处理 渲染元素
            vm[name] = e.target.value;
          });
          // node.value = vm[name]; // 将data的值赋给该node
          new Watcher(vm, node, name, 'value');
        }
      };
    }
    //节点类型为text文本节点
    if (node.nodeType === 3) {
      if (reg.test(node.nodeValue)) {
        var name = RegExp.$1; // 获取匹配到的字符串
        console.error(name)   // text
        name = name.trim();
        // node.nodeValue = vm[name]; // 将data的值赋给该node
        new Watcher(vm, node, name, 'nodeValue');
      }
    }
  },
}

