export async function getData(url: string, replace = true) {
  try {
    const data = await (await fetch(url)).text();
    return JSON.parse(replace ? data.replace(/"[\t ]*\/\/.*?$/gm, '"') : data);
  } catch (err) {
    console.log(`${url}: \n`, err);
    process.exit(1);
  }
}

export async function ensureAllFormattersAreLoaded() {
  if (window.formatters === undefined) {
    await Timeout(100);
    await ensureAllFormattersAreLoaded();
  }
}

export function Timeout(time: number) {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, time);
  });
}

export function getBugReportLinkBody(text?: string) {
  if (text) {
    const a = `**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
    
**Expected behavior**
A clear and concise description of what you expected to happen.

**Code**
\`\`\`sass
${text}
\`\`\`
`;
    return `&body=${encodeURIComponent(a)}`;
  }
  return '';
}

export const initialEditorValue =
  new URL(window.location.href).searchParams.get('value') ||
  `$bg: #1E1E1E
$text: #9cdcfe
$shadow: #0002
$fonts: monaco, Consolas, 'Lucida Console', monospace

body
  padding: 0
    margin: 0
   background: $bg
   color: $text
  font-family: $fonts
  display: flex
   flex-flow: column
  height: 100vh

.header
     background: lighten($bg, 2.5)
  box-shadow: 0 1px 4px $shadow
    padding: 1rem 2rem
  display: flex
  align-content: center
      align-items: center
  justify-content: center

.header-report-bug
      position: absolute
  right: 2rem

.header-title
  position: absolute
  left: 2rem
  font-size: 1.5rem

.content
  flex-grow: 1
  display: grid
      grid-template-rows: 2rem auto
  gap: 1rem
  margin: 1rem

.center-text
  text-align: center
       > code
    font-size: 1.1rem

.editor-container
  overflow: hidden

a
  color: $text
  text-decoration: none
  outline: none
  transition: color 100ms ease

     &:hover
    color: darken($text, 40)

  &:active
    text-decoration: underline

.loader-container
background: $bg
    position: absolute
  top: 0
      bottom: 0
  right: 0
  left: 0
  transition: opacity 200ms ease

.loader
  position: fixed
     border: 5px solid lighten($bg, 15)
  border-top: 5px solid $text
  border-radius: 50%
  background: #0000
       width: 25px
  height: 25px
  animation: spin 1s linear infinite
       top: 50%
  left: 50%
  transform: translate(-50%, -50%)

@keyframes spin
  from
    transform: rotate(0deg)

      to
    transform: rotate(360deg)

@media screen and ( max-width: 700px )
  .header
    flex-direction: column
       > *
      margin: 0.3rem 0
      .content
    max-height: 80vh

select
  display: inline-block
box-sizing: border-box
  font: inherit
     line-height: inherit
  -webkit-appearance: none
  -moz-appearance: none
       -ms-appearance: none
       appearance: none
       outline: none
  border: none

  color: $text

  border-radius: 5px

  padding: 0.5em 2em 0.5em 0.5em

     background-color: lighten($bg, 10)
       background-repeat: no-repeat
  background-image: linear-gradient(45deg, transparent 49.5%, currentColor 50%), linear-gradient(135deg, currentColor 49.5%, transparent 50%)
        background-position: right 15px top 1em, right 10px top 1em
  background-size: 5px 5px, 5px 5px

  transition: background 200ms ease

  cursor: pointer

  &:hover
    background-color: lighten($bg, 20)


`;
