(function(exports){
    var data = {}, fields = ['setup', 'loop', 'output', 'gui'];

    var modal = document.getElementById('colorform');

    Object.assign(modal, {
        hide: function(){
            this.style.display = "none";
        },
        show: function(){
            this.style.display = "block";
        },
    });


    var content = document.createElement('div');
    content.className = 'modal-content';

    var setcol = document.createElement('button');
    setcol.style.float = 'right';
    setcol.innerHTML = 'Update';

    fields.map(function(i){
        data[i] = "";
        var e = document.createElement('span');
        e.innerHTML = i.charAt(0).toUpperCase() + i.slice(1);
        content.appendChild(e);
        e = document.createElement('pre');
        e.id = i; e.contentEditable = true;
        content.appendChild(e);
    });


    var setf = (d) => console.log(d);
    var set = function(){
        Object.assign(data, ...fields.map(i => ({[i]: document.getElementById(i).innerText})));
        setf(data);
        modal.hide();
    };

    setcol.onclick = set;
    content.appendChild(setcol);
    modal.appendChild(content);

    window.onclick = e => (e.target == modal) ? modal.hide() : false;

    Object.assign(exports, {
        set: set,
        data: data,
        fields: fields,
        onSet: (e) => setf = e,
        show: () => modal.show(),
        fill: function(d){
            Object.assign(data, d);
            fields.map(i => document.getElementById(i).innerText = d[i]);
        },
    });
})(this.FORM = {});
