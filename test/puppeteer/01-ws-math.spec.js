import { after, before, beforeEach, describe, it } from 'mocha'
import { expect } from 'chai'
import { playStrokes, getStrokesFromJIIX } from './helper'
import config from '../lib/configuration'

describe('[WS][Math]', () => {
  let page
  let init
  const mathConfig = config.getConfiguration('MATH', 'WEBSOCKET', 'V4')
  const equation = mathConfig.inks
    .filter(ink => ['equation3'].includes(ink.name))
  const fence = mathConfig.inks
    .filter(ink => ['fence'].includes(ink.name))

  // use template literals because of babel
  // https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#code-transpilation-issues
  const exported = `(async () => {
    return new Promise((resolve, reject) => {
      document.getElementById('editor').addEventListener('exported', (e) => {
        resolve('exported');
      });
    });
  })()`

  before(async () => {
    page = await browser.newPage()

    init = async () => {
      await page.waitFor('#editor')
      const editorEl = await page.$('#editor')
      await editorEl.evaluate(node => node.editor.recognizerContext.initPromise)
      const initialized = await editorEl.evaluate(node => node.editor.initialized)
      expect(initialized).to.be.true
      return editorEl
    }
  })

  after(async () => {
    await page.close()
  })

  beforeEach(async () => {
    await page.goto(`${process.env.LAUNCH_URL}/${mathConfig.componentPath}`)
  })

  it('should test undo/redo with equation3', async () => {
    //undo redo default mode (stroke one), then session mode, then stroke mode
    const editorEl = await init()

    await playStrokes(page, equation[0].strokes, 100, 100)

    await page.evaluate(exported)

    let jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length)
    let latex = await editorEl.evaluate(node => node.editor.model.exports['application/x-latex'])
    expect(latex).to.equal(equation[0].exports.LATEX[equation[0].exports.LATEX.length - 1])

    let clearClick = page.click('#clear')
    let exportedEvent = page.evaluate(exported)

    await Promise.all([clearClick, exportedEvent])

    let exports = await editorEl.evaluate(node => node.editor.model.exports)
    if (exports !== undefined) {
      expect(exports['application/x-latex']).to.equal('')
    } else {
      expect(exports).to.be.undefined
    }

    await page.click('#undo')
    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length)

    await page.click('#undo')
    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length - 1)

    await page.click('#undo')
    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length - 2)

    await page.click('#redo')
    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length - 1)

    clearClick = page.click('#clear')
    exportedEvent = page.evaluate(exported)
    await Promise.all([clearClick, exportedEvent])

    await editorEl.evaluate(node => {
      node.editor.close()
        .then(() => {
          console.log('editor close')
        })
        .catch((e) => console.error(e))
      node.editor.configuration.recognitionParams.iink.math['undo-redo'] = {mode: 'session'}
    })

    let initialized = await editorEl.evaluate(node => node.editor.initialized)
    expect(initialized).to.be.true

    await playStrokes(page, equation[0].strokes, 100, 100)

    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length)
    latex = await editorEl.evaluate(node => node.editor.model.exports['application/x-latex'])
    expect(latex).to.equal(equation[0].exports.LATEX[equation[0].exports.LATEX.length - 1])

    clearClick = page.click('#clear')
    exportedEvent = page.evaluate(exported)

    await Promise.all([clearClick, exportedEvent])

    exports = await editorEl.evaluate(node => node.editor.model.exports)
    if(exports !== undefined) {
      jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
      expect(getStrokesFromJIIX(jiix).length).to.equal(0)
    } else {
      expect(exports).to.be.undefined
    }

    await page.click('#undo')
    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length)

    await page.click('#undo')
    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(0)

    await page.click('#redo')
    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length)
    latex = await editorEl.evaluate(node => node.editor.model.exports['application/x-latex'])
    expect(latex).to.equal(equation[0].exports.LATEX[equation[0].exports.LATEX.length - 1])

    clearClick = page.click('#clear')
    exportedEvent = page.evaluate(exported)

    await Promise.all([clearClick, exportedEvent])

    await editorEl.evaluate(node => {
      node.editor.close()
        .then(() => {
          console.log('editor close')
        })
        .catch((e) => console.error(e))
      node.editor.configuration.recognitionParams.iink.math['undo-redo'] = {mode: 'stroke'}
    })

    initialized = await editorEl.evaluate(node => node.editor.initialized)
    expect(initialized).to.be.true

    await playStrokes(page, equation[0].strokes, 100, 100)

    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length)
    latex = await editorEl.evaluate(node => node.editor.model.exports['application/x-latex'])
    expect(latex).to.equal(equation[0].exports.LATEX[equation[0].exports.LATEX.length - 1])

    clearClick = page.click('#clear')
    exportedEvent = page.evaluate(exported)

    await Promise.all([clearClick, exportedEvent])

    exports = await editorEl.evaluate(node => node.editor.model.exports)
    if (exports !== undefined) {
      expect(exports['application/x-latex']).to.equal('')
    } else {
      expect(exports).to.be.undefined
    }

    await page.click('#undo')
    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length)

    await page.click('#undo')
    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length - 1)

    await page.click('#undo')
    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length - 2)

    await page.click('#redo')
    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length - 1)

  })

  it('should test convert with equation3', async () => {
    const editorEl = await init()

    await playStrokes(page, equation[0].strokes, 100, 100)

    await page.evaluate(exported)

    const jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length)
    const latex = await editorEl.evaluate(node => node.editor.model.exports['application/x-latex'])
    expect(latex).to.equal(equation[0].exports.LATEX[equation[0].exports.LATEX.length - 1])

    await page.click('#convert')
    await page.evaluate(exported)

    const latexConv = await editorEl.evaluate(node => node.editor.model.exports['application/x-latex'])
    expect(latexConv).to.equal(equation[0].exports.LATEX[equation[0].exports.LATEX.length - 1])
  })

  it('should test math flavor with fences', async () => {
    const editorEl = await init()
    await editorEl.evaluate(node => {
      node.editor.close()
        .then(() => {
          console.log('editor close')
        })
        .catch((e) => console.error(e))
      node.editor.configuration.recognitionParams.iink.math.mimeTypes.push('application/mathml+xml')
      node.editor.configuration.recognitionParams.iink.export.mathml = { flavor: 'standard' }
    })

    let initialized = await editorEl.evaluate(node => node.editor.initialized)
    expect(initialized).to.be.true

    await playStrokes(page, fence[0].strokes, 100, 175)

    await page.evaluate(exported)

    let jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(fence[0].strokes.length)
    let mathml = await editorEl.evaluate(node => node.editor.model.exports['application/mathml+xml'])
    expect(mathml.trim().replace(/ /g,'')).to.equal(fence[0].exports.MATHML.STANDARD[fence[0].exports.MATHML.STANDARD.length - 1].trim().replace(/ /g,''))

    await page.click('#clear')
    await page.evaluate(exported)

    // now flavor is "ms-office"
    await editorEl.evaluate(node => {
      node.editor.close()
        .then(() => {
          console.log('editor close')
        })
        .catch((e) => console.error(e))
      node.editor.configuration.recognitionParams.iink.export.mathml = { flavor: 'ms-office' }
    })
    initialized = await editorEl.evaluate(node => node.editor.initialized)
    expect(initialized).to.be.true

    await playStrokes(page, fence[0].strokes, 100, 175)

    await page.evaluate(exported)

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(fence[0].strokes.length)
    mathml = await editorEl.evaluate(node => node.editor.model.exports['application/mathml+xml'])
    expect(mathml.trim().replace(/ /g,'')).to.equal(fence[0].exports.MATHML.MSOFFICE[fence[0].exports.MATHML.MSOFFICE.length - 1].trim().replace(/ /g,''))
  })

  it('should test each label of strokes', async () => {
    const editorEl = await init()

    for (const [index, strokes] of equation[0].strokes.entries()) {
      await playStrokes(page, [strokes], 100, 100)

      await page.evaluate(exported)

      const latex = await editorEl.evaluate(node => node.editor.model.exports['application/x-latex'])
      expect(latex).to.equal(equation[0].exports.LATEX[index])
    }
  })

  it('should test undo/redo with reconnect', async () => {
    const editorEl = await init()

    await playStrokes(page, equation[0].strokes, 100, 100)

    await page.evaluate(exported)

    let jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length)
    let latex = await editorEl.evaluate(node => node.editor.model.exports['application/x-latex'])
    expect(latex).to.equal(equation[0].exports.LATEX[equation[0].exports.LATEX.length - 1])

    const clearClick = page.click('#clear')
    const exportedEvent = page.evaluate(exported)

    await Promise.all([clearClick, exportedEvent])

    const exports = await editorEl.evaluate(node => node.editor.model.exports)
    if (exports !== undefined) {
      expect(exports['application/x-latex']).to.equal('')
    } else {
      expect(exports).to.be.undefined
    }

    await editorEl.evaluate((node) => {
      node.editor.recognizer.close(node.editor.recognizerContext, node.editor.model)
        .then(() => console.log('socket closed'))
    })

    for (const [index, strokes] of equation[0].strokes.entries()) {
      await playStrokes(page, [strokes], 100, 100)
      await page.evaluate(exported)
    }

    jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
    expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length)
    latex = await editorEl.evaluate(node => node.editor.model.exports['application/x-latex'])
    expect(latex).to.equal(equation[0].exports.LATEX[equation[0].exports.LATEX.length - 1])

    for (const [index] of equation[0].strokes.entries()) {
      const undoElement = await page.$('#undo')
      const disabled = await undoElement.evaluate(node => node.disabled)
      if (disabled) {
        const exports = await editorEl.evaluate(node => node.editor.model.exports)
        expect(exports).to.be.undefined
      } else {
        await undoElement.click()
        await page.evaluate(exported)

        jiix = await editorEl.evaluate(node => node.editor.model.exports['application/vnd.myscript.jiix'])
        latex = await editorEl.evaluate(node => node.editor.model.exports['application/x-latex'])
        expect(getStrokesFromJIIX(jiix).length).to.equal(equation[0].strokes.length - index - 1)
      }
    }
  })
})
