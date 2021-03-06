/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const MeshRenderer = require('../../../components/CCMeshRenderer');
const RenderFlow = require('../../render-flow');
const vfmtPosUvColor = require('../vertex-format').vfmtPosUvColor;

let meshRendererAssembler = {
    useModel: true,
    updateRenderData (comp) {
        let renderDatas = comp._renderDatas;
        renderDatas.length = 0;
        if (!comp.mesh) return;
        let submeshes = comp.mesh._subMeshes;
        for (let i = 0; i < submeshes.length; i++) {
            let IARenderData = cc.renderer.renderEngine.IARenderData;
            let data = new IARenderData();
            data.material = comp._materials[i];
            data.ia = submeshes[i];
            renderDatas.push(data);
        }
    },

    fillBuffers (comp, renderer) {
        if (!comp.mesh) return;

        renderer._flush();

        let tmpNode = renderer.node;
        let tmpMaterial = renderer.material;
        renderer.node = comp.node;

        let textures = comp.textures;
        let materials = comp._materials;
        let renderDatas = comp._renderDatas;
        for (let i = 0; i < renderDatas.length; i++) {
            let renderData = renderDatas[i];
            if (!textures[i]) {
                continue;
            }
            renderData.material.texture = textures[i];
            renderer.material = renderData.material;
            renderer._flushIA(renderData);
        }

        renderer.node = tmpNode;
        renderer.material = tmpMaterial;
    }
};

module.exports = MeshRenderer._assembler = meshRendererAssembler;
