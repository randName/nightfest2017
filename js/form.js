var FORM = {
    modal: null,
    fields: ['setup', 'loop', 'output'],
    show: function(){ this.modal.style.display = "block"; },
    hide: function(){ this.modal.style.display = "none"; },
    init: function(){
        this.modal = document.getElementById('colorform');

        var e, content = document.createElement('div');
        content.className = 'modal-content';

        this.fields.map(function(i){
            e = document.createElement('span');
            e.innerHTML = i.charAt(0).toUpperCase() + i.slice(1);
            content.appendChild(e);
            e = document.createElement('pre');
            e.id = i; e.contentEditable = true;
            content.appendChild(e);
        });

        var setcol = document.createElement('button');
        setcol.style.float = 'right';
        setcol.innerHTML = 'Update';
        setcol.onclick = this.set.bind(this);
        content.appendChild(setcol);
        this.modal.appendChild(content);

        document.getElementById('colbtn').onclick = this.show.bind(this);
        window.onclick = (function(e){if (e.target == this.modal) this.hide();}).bind(this);
    },
    fill: function(param){
        this.fields.map(function(i){ document.getElementById(i).innerText = param[i]; })
    },
    save: function(){
        this.raw = this.fields.reduce((o, i) => Object.assign(o, {[i]: document.getElementById(i).innerText}), {});
        return this.raw;
    },
    set: function(){
        LIGHTS.set(this.save());
        this.hide();
    },
}
