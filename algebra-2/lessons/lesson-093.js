(function(global){
'use strict';
const E = global.Algebra2Engine;
if(!E) throw Error('Algebra2Engine must load before Lesson 93.');
const {esc,math,frac,root,panel,callout,choice,makeChoices}=E.helpers;
const Q=(id,section,label,skill,type,prompt,rest)=>({id,section,label,skill,type,prompt,...rest});

const topics=[
{
 id:'why-division',
 title:'Polynomial division can expose a hidden factor',
 short:'Why divide?',
 intro:'When a complicated numerator does not factor quickly, polynomial division can test whether the denominator divides it evenly.',
 body:
  `<p>The lesson begins with a one-variable reminder:</p>${panel(frac('x<sup>3</sup>−2x<sup>2</sup>−5x+6','x+2'))}<p>Dividing by ${math('x+2')} gives ${math('x<sup>2</sup>−4x+3')} with remainder 0. That means the numerator contains ${math('x+2')} as a factor, so the fraction reduces.</p>`,
 steps:[
  ['Divide the numerator by the denominator.', 'Treat the rational expression as a polynomial-division problem.'],
  ['Watch the remainder.', 'A remainder of 0 means the divisor is an exact factor of the numerator.'],
  ['Reduce the fraction.', math(frac('(x+2)(x<sup>2</sup>−4x+3)','x+2')+'=x<sup>2</sup>−4x+3')+'.']
 ],
 after:callout('Zero remainder matters','If the remainder is not zero, the denominator does not divide evenly into the numerator and this cancellation is not available.'),
 mini:{prompt:'If a polynomial is divided by '+math('x−4')+' and the remainder is 0, what does that tell you?',options:['x−4 is a factor','x−4 is not a factor','the quotient must be 0'],correct:0,explain:'A zero remainder means the divisor is an exact factor.'}
},
{
 id:'setup-order',
 title:'Set up multivariable long division carefully',
 short:'Order the terms',
 intro:'The long-division process is the same with several variables, but the terms must stay aligned in the correct columns.',
 body:
  `<p>The lesson divides</p>${panel(frac('2x<sup>3</sup>−x<sup>2</sup>y−2xy<sup>2</sup>+y<sup>3</sup>','x+y'))}<p>Because the divisor begins with ${math('x')}, the dividend is ordered by descending powers of ${math('x')}: ${math('x<sup>3</sup>')}, then ${math('x<sup>2</sup>')}, then ${math('x')}, then the term with no ${math('x')}.</p>`,
 steps:[
  ['Choose the ordering variable.', 'Use the first variable shown in the divisor. Here that is '+math('x')+'.'],
  ['Order the dividend.', math('2x<sup>3</sup>−x<sup>2</sup>y−2xy<sup>2</sup>+y<sup>3</sup>')+' is already in descending x-power order.'],
  ['Insert missing columns if needed.', 'If an x-power were missing, use a zero-coefficient placeholder so later subtraction stays aligned.']
 ],
 after:callout('Columns are part of the method','A term such as y² has no x, so it belongs with the x⁰ terms rather than under an x-term.'),
 mini:{prompt:'When dividing by '+math('x+y')+', which variable determines the term order in the lesson method?',options:['x','y','either at random'],correct:0,explain:'The source orders by the first variable in the divisor, x.'}
},
{
 id:'divide-multiply',
 title:'Divide, then multiply back',
 short:'Divide & multiply',
 intro:'Each quotient term comes from dividing the leading term of the current work by the leading term of the divisor.',
 body:
  `${panel('2x<sup>3</sup> ÷ x = 2x<sup>2</sup>')}<p>Place ${math('2x<sup>2</sup>')} in the quotient. Then multiply it by the whole divisor:</p>${panel('2x<sup>2</sup>(x+y)=2x<sup>3</sup>+2x<sup>2</sup>y')}`,
 steps:[
  ['Divide leading terms.', math('2x<sup>3</sup>÷x=2x<sup>2</sup>')+'.'],
  ['Write the quotient term above the matching column.', 'The '+math('2x<sup>2</sup>')+' is placed over the x² column.'],
  ['Multiply by every term in the divisor.', math('2x<sup>2</sup>(x+y)=2x<sup>3</sup>+2x<sup>2</sup>y')+'.']
 ],
 after:callout('Multiply the entire divisor','Once a quotient term is found, distribute it across every term of the divisor before subtracting.'),
 mini:{prompt:'If the current leading term is '+math('−3x<sup>2</sup>y')+' and the divisor begins with x, what is the next quotient term?',options:['−3xy','−3x²y','3xy'],correct:0,explain:'Divide −3x²y by x to get −3xy.'}
},
{
 id:'subtract-bringdown',
 title:'Subtract, then bring down the next term',
 short:'Subtract & continue',
 intro:'After multiplication, subtract the entire product from the current row, combine like terms, and bring down the next term.',
 body:
  `<p>In the source example, subtracting the first product leaves ${math('−3x<sup>2</sup>y')}. Then ${math('−2xy<sup>2</sup>')} is brought down.</p><p>The next quotient term is ${math('−3xy')}, because ${math('−3x<sup>2</sup>y÷x=−3xy')}.</p>`,
 steps:[
  ['Subtract matching columns.', 'The leading terms should cancel.'],
  ['Bring down the next term.', 'Keep every term aligned with the same powers of the ordering variable.'],
  ['Repeat divide and multiply.', math('−3xy(x+y)=−3x<sup>2</sup>y−3xy<sup>2</sup>')+'.'],
  ['Subtract again.', 'The new remainder portion becomes '+math('xy<sup>2</sup>')+'.']
 ],
 after:callout('A sign error propagates','Long division depends on correct subtraction. Treat the whole product being subtracted as one grouped expression.'),
 mini:{prompt:'What operation follows multiplying a quotient term by the divisor?',options:['Subtract the product','Add the product','Stop immediately'],correct:0,explain:'The long-division cycle is divide, multiply, subtract, bring down.'}
},
{
 id:'zero-remainder',
 title:'A zero remainder gives a reducible fraction',
 short:'Finish the division',
 intro:'Continue the cycle until no terms remain. In the lesson example, the final remainder is zero.',
 body:
  `${panel(frac('2x<sup>3</sup>−x<sup>2</sup>y−2xy<sup>2</sup>+y<sup>3</sup>','x+y')+' = 2x<sup>2</sup>−3xy+y<sup>2</sup>')}<p>Because the remainder is 0, the numerator factors as</p>${panel('(x+y)(2x<sup>2</sup>−3xy+y<sup>2</sup>)')}<p>and the rational expression reduces by canceling ${math('x+y')}.</p>`,
 steps:[
  ['Find the final quotient term.', math('xy<sup>2</sup>÷x=y<sup>2</sup>')+'.'],
  ['Multiply back.', math('y<sup>2</sup>(x+y)=xy<sup>2</sup>+y<sup>3</sup>')+'.'],
  ['Subtract.', 'The remainder is 0.'],
  ['Interpret the result.', 'The quotient is '+math('2x<sup>2</sup>−3xy+y<sup>2</sup>')+'.']
 ],
 after:callout('Division doubles as a factoring tool','A zero remainder proves the divisor is a factor of the numerator.'),
 mini:{prompt:'The lesson example ends with what remainder?',options:['0','1','y²'],correct:0,explain:'The final subtraction leaves 0.'}
},
{
 id:'factor-patterns',
 title:'Keep factoring patterns available',
 short:'Factoring review',
 intro:'Practice 93 and Problem Set 93 continue to use common-factor, perfect-square, and difference-of-squares patterns.',
 body:
  `${panel('A<sup>2</sup>−B<sup>2</sup>=(A+B)(A−B)<br>A<sup>2</sup>+2AB+B<sup>2</sup>=(A+B)<sup>2</sup>')}<p>Many rational expressions become simple only after these factors are exposed.</p>`,
 steps:[
  ['Greatest common factor.', 'Factor the largest monomial shared by every term.'],
  ['Perfect square.', 'Check whether the middle term is twice the product of the square roots.'],
  ['Difference of squares.', 'Use opposite signs in the two factors.']
 ],
 after:callout('Factor before canceling','Only common factors may cancel; terms joined by addition or subtraction cannot cancel directly.'),
 mini:{prompt:'Factor '+math('a<sup>2</sup>+2ab+b<sup>2</sup>')+'.',options:['(a+b)²','(a−b)²','(a+b)(a−b)'],correct:0,explain:'It is a perfect-square trinomial.'}
},
{
 id:'mixed-review',
 title:'Use prior algebra and geometry skills in the review',
 short:'Mixed review',
 intro:'Problem Set 93 includes scientific notation, coordinate geometry, equations, formula substitution, line equations, and a triangle application.',
 body:
  `${panel('m='+frac('y<sub>2</sub>−y<sub>1</sub>','x<sub>2</sub>−x<sub>1</sub>')+'<br>distance='+root('(Δx)<sup>2</sup>+(Δy)<sup>2</sup>'))}<p>The hyperbola form used in the review is ${math(frac('x<sup>2</sup>','a<sup>2</sup>')+'−'+frac('y<sup>2</sup>','b<sup>2</sup>')+'=1')}.</p>`,
 steps:[
  ['Scientific notation.', 'Write the coefficient between 1 and 10 and track the decimal shift with a power of 10.'],
  ['Coordinate review.', 'Use exact labeled points and standard graph forms.'],
  ['Line equations.', 'Find the slope, then use point-slope or slope-intercept form.'],
  ['Applications.', 'Translate the stated relationships into one equation before solving.']
 ],
 after:callout('Mixed review still uses exact source data','Use the coordinates, rates, and angle relationships exactly as given in each exercise.'),
 mini:{prompt:'A horizontal line has which slope?',options:['0','undefined','1'],correct:0,explain:'A horizontal line has zero rise.'}
}
];

function buildQuestions(){
 const q=[];

 // Practice 93
 q.push(Q('p93-a','practice','a','Difference-of-squares factoring','choice','Select the factored form of '+math('25x<sup>2</sup>y<sup>2</sup>−36q<sup>4</sup>p<sup>4</sup>')+'.',{
  page:456,
  choices:makeChoices([
   '(25xy−36qp)(25xy+36qp)',
   '(5xy−6qp)(5xy+6qp)',
   '(5xy+6q<sup>2</sup>p<sup>2</sup>)(5xy−6q<sup>2</sup>p<sup>2</sup>)',
   '(5xy−6qp)(5xy−6q<sup>2</sup>p<sup>2</sup>)',
   '(5xy+6q<sup>2</sup>p<sup>2</sup>)(5xy+6q<sup>2</sup>p<sup>2</sup>)'
  ]),
  correct:2,
  answerHTML:'(5xy+6q<sup>2</sup>p<sup>2</sup>)(5xy−6q<sup>2</sup>p<sup>2</sup>)',
  answerText:'(5xy+6q^2p^2)(5xy-6q^2p^2)',lesson:'factor-patterns',
  guide:['Rewrite each term as a square.','Use one plus factor and one minus factor.'],
  hints:['25x²y²=(5xy)².','36q⁴p⁴=(6q²p²)².'],
  solution:[math('25x<sup>2</sup>y<sup>2</sup>−36q<sup>4</sup>p<sup>4</sup>=(5xy)<sup>2</sup>−(6q<sup>2</sup>p<sup>2</sup>)<sup>2</sup>')+'.','Apply the difference-of-squares pattern.'],
  check:'This is choice C.'
 }));
 q.push(Q('p93-b','practice','b','Difference-of-squares multiplication','choice','Select the simplified form of '+math('(4ab+5cd)(4ab−5cd)')+'.',{
  page:456,
  choices:makeChoices([
   '16a<sup>2</sup>b<sup>2</sup>+25c<sup>2</sup>d<sup>2</sup>',
   '16a<sup>2</sup>b<sup>2</sup>+40abcd−25c<sup>2</sup>d<sup>2</sup>',
   '8ab',
   '8a<sup>2</sup>b<sup>2</sup>−10c<sup>2</sup>d<sup>2</sup>',
   '16a<sup>2</sup>b<sup>2</sup>−25c<sup>2</sup>d<sup>2</sup>'
  ]),
  correct:4,
  answerHTML:'16a<sup>2</sup>b<sup>2</sup>−25c<sup>2</sup>d<sup>2</sup>',
  answerText:'16a^2b^2-25c^2d^2',lesson:'factor-patterns',
  guide:['Recognize conjugate factors.','Square the first quantity and subtract the square of the second.'],
  hints:['Use (A+B)(A−B)=A²−B².'],
  solution:[math('(4ab)<sup>2</sup>−(5cd)<sup>2</sup>=16a<sup>2</sup>b<sup>2</sup>−25c<sup>2</sup>d<sup>2</sup>')+'.'],
  check:'This is choice E.'
 }));
 q.push(Q('p93-c','practice','c','Subtracting rational expressions','choice','Select the simplified form of '+math(frac('3x+8b','x<sup>2</sup>+6bx+8b<sup>2</sup>')+' − '+frac('2','x+4b'))+'.',{
  page:456,
  choices:makeChoices([
   frac('3x+8b−2','x<sup>2</sup>+6bx+8b<sup>2</sup>'),
   frac('1','x+2b'),
   frac('2b','x+4b'),
   frac('x+10b','x<sup>2</sup>+6bx+8b<sup>2</sup>'),
   frac('1','x+4b')
  ]),
  correct:1,
  answerHTML:frac('1','x+2b'),answerText:'1/(x+2b)',lesson:'factor-patterns',
  guide:['Factor the quadratic denominator.','Use the common denominator.','Simplify and cancel.'],
  hints:['x²+6bx+8b²=(x+2b)(x+4b).','Rewrite 2/(x+4b) with the common denominator.'],
  solution:['The common denominator is '+math('(x+2b)(x+4b)')+'.','The numerator becomes '+math('(3x+8b)−2(x+2b)=x+4b')+'.','Cancel '+math('x+4b')+' to get '+math(frac('1','x+2b'))+'.'],
  check:'This is choice B.'
 }));
 q.push(Q('p93-d','practice','d','Polynomial division','choice','Select the simplified form of '+math(frac('2x<sup>3</sup>+3x<sup>2</sup>y−4xy<sup>2</sup>−y<sup>3</sup>','x−y'))+'.',{
  page:456,
  choices:makeChoices([
   '2x<sup>2</sup>−3y<sup>2</sup>',
   '3xy−2y<sup>2</sup>',
   '2x<sup>2</sup>+5xy+y<sup>2</sup>',
   '2x<sup>2</sup>+3x<sup>2</sup>y−4xy<sup>2</sup>+y<sup>2</sup>',
   '2x<sup>2</sup>+xy−3y<sup>2</sup>'
  ]),
  correct:2,
  answerHTML:'2x<sup>2</sup>+5xy+y<sup>2</sup>',
  answerText:'2x^2+5xy+y^2',lesson:'zero-remainder',
  guide:['Divide the polynomial by x−y.','Check the quotient by multiplying back.'],
  hints:['The leading term is 2x².','A correct quotient multiplied by x−y must reproduce the numerator.'],
  solution:[math('(x−y)(2x<sup>2</sup>+5xy+y<sup>2</sup>)=2x<sup>3</sup>+3x<sup>2</sup>y−4xy<sup>2</sup>−y<sup>3</sup>')+'.','Therefore the quotient is '+math('2x<sup>2</sup>+5xy+y<sup>2</sup>')+'.'],
  check:'This is choice C.'
 }));
 q.push(Q('p93-e','practice','e','Triangle-angle application','numeric','The second angle of a triangle is 40° larger than the first, and the third angle is 2 times the second. How big is the first angle?',{
  page:456,
  fields:[{key:'angle',label:'First angle',suffix:'degrees',placeholder:'number',value:15,tolerance:1e-9}],
  answerHTML:'15°',answerText:'15',lesson:'mixed-review',
  guide:['Let x be the first angle.','Write the second and third angles in terms of x.','Use the 180° triangle sum.'],
  hints:['Second: x+40.','Third: 2(x+40).','x+(x+40)+2(x+40)=180.'],
  solution:[math('x+x+40+2x+80=180')+'.',math('4x+120=180')+', so '+math('x=15')+'.'],
  check:'The angles are 15°, 55°, and 110°, which total 180°.'
 }));

 // Problem Set 93
 q.push(Q('ps93-1','problem','1','Scientific notation','scientific','Rewrite '+math('795,000,000')+' in scientific notation.',{
  page:457,
  fields:[
   {key:'coefficient',label:'Coefficient',placeholder:'e.g., 7.95',value:7.95,tolerance:1e-10},
   {key:'exponent',label:'Exponent of 10',placeholder:'integer',value:8,tolerance:0}
  ],
  answerHTML:'7.95 × 10<sup>8</sup>',answerText:'7.95×10^8',lesson:'mixed-review',
  guide:['Move the decimal so the coefficient is between 1 and 10.','Count the number of places moved.'],
  hints:['The coefficient is 7.95.','The decimal moves 8 places left.'],
  solution:[math('795,000,000=7.95×10<sup>8</sup>')+'.']
 }));
 q.push(Q('ps93-2','problem','2','Scientific notation','scientific','Rewrite '+math('0.00000000032')+' in scientific notation.',{
  page:457,
  fields:[
   {key:'coefficient',label:'Coefficient',placeholder:'e.g., 3.2',value:3.2,tolerance:1e-10},
   {key:'exponent',label:'Exponent of 10',placeholder:'integer',value:-10,tolerance:0}
  ],
  answerHTML:'3.2 × 10<sup>−10</sup>',answerText:'3.2×10^-10',lesson:'mixed-review',
  guide:['Move the decimal until the coefficient is 3.2.','Count places and use a negative exponent for this small number.'],
  hints:['The decimal moves 10 places right.'],
  solution:[math('0.00000000032=3.2×10<sup>−10</sup>')+'.']
 }));
 q.push(Q('ps93-3','problem','3','Distance between points','numeric','Find the distance between '+math('(−5,0)')+' and '+math('(−2,1)')+'.',{
  page:457,
  fields:[{key:'distance',label:'Distance',placeholder:'sqrt(10) or decimal',value:10**0.5,tolerance:0.005}],
  answerHTML:root('10')+' ≈ 3.16',answerText:'sqrt(10)',lesson:'mixed-review',
  guide:['Find the horizontal and vertical changes.','Use the distance formula.'],
  hints:['Δx=3 and Δy=1.','d=√(3²+1²).'],
  solution:[math('d='+root('9+1')+'='+root('10'))+'.']
 }));
 q.push(Q('ps93-4','problem','4','Horizontal or vertical line','choice','Tell whether the line '+math('y=0x−5')+' is horizontal or vertical.',{
  page:457,
  choices:makeChoices(['Horizontal','Vertical']),
  correct:0,
  answerHTML:'Horizontal',answerText:'Horizontal',lesson:'mixed-review',
  guide:['Simplify the equation first.'],
  hints:['0x=0, so the equation is y=−5.'],
  solution:['The equation is '+math('y=−5')+', a horizontal line.']
 }));
 q.push(Q('ps93-5','problem','5','Hyperbola center, vertices, and direction','mixed','For '+math(frac('x<sup>2</sup>','16')+' − '+frac('y<sup>2</sup>','36')+' = 1')+', give the center and the two vertices, then tell whether it opens left/right or up/down.',{
  page:457,
  choices:makeChoices(['Opens left and right','Opens up and down']),
  correct:0,
  fields:[
   {key:'cx',label:'Center x',placeholder:'number',value:0,tolerance:1e-9},
   {key:'cy',label:'Center y',placeholder:'number',value:0,tolerance:1e-9},
   {key:'leftx',label:'Left vertex x',placeholder:'number',value:-4,tolerance:1e-9},
   {key:'lefty',label:'Left vertex y',placeholder:'number',value:0,tolerance:1e-9},
   {key:'rightx',label:'Right vertex x',placeholder:'number',value:4,tolerance:1e-9},
   {key:'righty',label:'Right vertex y',placeholder:'number',value:0,tolerance:1e-9}
  ],
  answerHTML:'Center (0,0); vertices (−4,0) and (4,0); opens left and right',
  answerText:'center (0,0), vertices (-4,0),(4,0), left/right',lesson:'mixed-review',
  guide:['Compare with x²/a²−y²/b²=1.','The positive x² term means a horizontal hyperbola.'],
  hints:['a²=16, so a=4.','Vertices are (±4,0).'],
  solution:['The center is '+math('(0,0)')+'.','Because '+math('a=4')+' and the x² term is positive, the vertices are '+math('(−4,0)')+' and '+math('(4,0)')+', and the hyperbola opens left and right.']
 }));
 q.push(Q('ps93-6','problem','6','Greatest-common-factor factoring','choice','Select the factored form of '+math('5x<sup>2</sup>y<sup>3</sup>z<sup>2</sup>+15xy<sup>2</sup>z<sup>3</sup>')+'.',{
  page:457,
  choices:makeChoices([
   '5xy<sup>2</sup>z<sup>2</sup>(xy+3z)',
   '15xy<sup>2</sup>z<sup>2</sup>(3xy+z)',
   '5xy<sup>2</sup>z<sup>2</sup>(xy+10z)',
   '5x<sup>2</sup>y<sup>3</sup>z<sup>2</sup>(1+3xyz)',
   '5xy<sup>2</sup>z<sup>3</sup>(xyz+3)'
  ]),
  correct:0,
  answerHTML:'5xy<sup>2</sup>z<sup>2</sup>(xy+3z)',answerText:'5xy^2z^2(xy+3z)',lesson:'factor-patterns',
  guide:['Find the greatest shared coefficient and variable powers.'],
  hints:['The greatest common monomial is 5xy²z².'],
  solution:[math('5x<sup>2</sup>y<sup>3</sup>z<sup>2</sup>+15xy<sup>2</sup>z<sup>3</sup>=5xy<sup>2</sup>z<sup>2</sup>(xy+3z)')+'.'],
  check:'This is choice A.'
 }));
 q.push(Q('ps93-7','problem','7','Perfect-square factoring','choice','Select the factored form of '+math('a<sup>2</sup>+2ab+b<sup>2</sup>')+'.',{
  page:457,
  choices:makeChoices(['(a−b)(b−1)','(a+b)(a−b)','(a+b)<sup>2</sup>','(a−b)<sup>2</sup>','(a+b)(a+1)']),
  correct:2,
  answerHTML:'(a+b)<sup>2</sup>',answerText:'(a+b)^2',lesson:'factor-patterns',
  guide:['Recognize the perfect-square pattern.'],
  hints:['The middle term is +2ab.'],
  solution:[math('a<sup>2</sup>+2ab+b<sup>2</sup>=(a+b)<sup>2</sup>')+'.'],
  check:'This is choice C.'
 }));
 q.push(Q('ps93-8','problem','8','Difference-of-squares factoring','choice','Select the factored form of '+math('4r<sup>2</sup>t<sup>2</sup>−9u<sup>4</sup>v<sup>4</sup>')+'.',{
  page:457,
  choices:makeChoices([
   '(2rt+3u<sup>2</sup>v<sup>2</sup>)(2rt+3u<sup>2</sup>v<sup>2</sup>)',
   '(4rt+9uv)(4rt−9uv)',
   '(2rt+3uv)(2rt−3uv)',
   '(2rt−3u<sup>2</sup>v<sup>2</sup>)(2rt−3u<sup>2</sup>v<sup>2</sup>)',
   '(2rt+3u<sup>2</sup>v<sup>2</sup>)(2rt−3u<sup>2</sup>v<sup>2</sup>)'
  ]),
  correct:4,
  answerHTML:'(2rt+3u<sup>2</sup>v<sup>2</sup>)(2rt−3u<sup>2</sup>v<sup>2</sup>)',
  answerText:'(2rt+3u^2v^2)(2rt-3u^2v^2)',lesson:'factor-patterns',
  guide:['Take the square root of each term.','Use conjugate factors.'],
  hints:['4r²t²=(2rt)².','9u⁴v⁴=(3u²v²)².'],
  solution:[math('(2rt)<sup>2</sup>−(3u<sup>2</sup>v<sup>2</sup>)<sup>2</sup>')+' factors using the difference-of-squares pattern.'],
  check:'This is choice E.'
 }));
 q.push(Q('ps93-9','problem','9','Combining like terms','choice','Select the simplified form of '+math('−9p<sup>2</sup>qr<sup>4</sup>+5p<sup>2</sup>qr<sup>4</sup>')+'.',{
  page:457,
  choices:makeChoices(['−45p<sup>2</sup>qr<sup>4</sup>','−4p<sup>4</sup>q<sup>2</sup>r<sup>16</sup>','4p<sup>2</sup>qr<sup>4</sup>','−4p<sup>4</sup>q<sup>2</sup>r<sup>8</sup>','−4p<sup>2</sup>qr<sup>4</sup>']),
  correct:4,
  answerHTML:'−4p<sup>2</sup>qr<sup>4</sup>',answerText:'-4p^2qr^4',lesson:'mixed-review',
  guide:['The variable parts are identical, so combine only the coefficients.'],
  hints:['−9+5=−4.'],
  solution:[math('(−9+5)p<sup>2</sup>qr<sup>4</sup>=−4p<sup>2</sup>qr<sup>4</sup>')+'.'],
  check:'This is choice E.'
 }));
 q.push(Q('ps93-10','problem','10','Difference-of-squares multiplication','choice','Select the simplified form of '+math('(7xy+4pq)(7xy−4pq)')+'.',{
  page:457,
  choices:makeChoices([
   '49x<sup>2</sup>y<sup>2</sup>−16p<sup>2</sup>q<sup>2</sup>',
   '14xy',
   '49x<sup>2</sup>y<sup>2</sup>+16p<sup>2</sup>q<sup>2</sup>',
   '14x<sup>2</sup>y<sup>2</sup>−8p<sup>2</sup>q<sup>2</sup>',
   '49x<sup>2</sup>y<sup>2</sup>+56xypq−16p<sup>2</sup>q<sup>2</sup>'
  ]),
  correct:0,
  answerHTML:'49x<sup>2</sup>y<sup>2</sup>−16p<sup>2</sup>q<sup>2</sup>',
  answerText:'49x^2y^2-16p^2q^2',lesson:'factor-patterns',
  guide:['Recognize conjugates and use A²−B².'],
  hints:['A=7xy and B=4pq.'],
  solution:[math('(7xy)<sup>2</sup>−(4pq)<sup>2</sup>=49x<sup>2</sup>y<sup>2</sup>−16p<sup>2</sup>q<sup>2</sup>')+'.'],
  check:'This is choice A.'
 }));
 q.push(Q('ps93-11','problem','11','Reducing a rational expression','choice','Select the simplified form of '+math(frac('bx−ab','x<sup>2</sup>−2ax+a<sup>2</sup>'))+'.',{
  page:457,
  choices:makeChoices([frac('b','(x+a)<sup>2</sup>'),frac('b','x−a'),frac('b','x<sup>2</sup>−a<sup>2</sup>'),frac('b','x+a'),frac('b','(x−a)<sup>2</sup>')]),
  correct:1,
  answerHTML:frac('b','x−a'),answerText:'b/(x-a)',lesson:'factor-patterns',
  guide:['Factor numerator and denominator.','Cancel the common factor.'],
  hints:['bx−ab=b(x−a).','x²−2ax+a²=(x−a)².'],
  solution:[math(frac('b(x−a)','(x−a)<sup>2</sup>')+'='+frac('b','x−a'))+'.'],
  check:'This is choice B.'
 }));
 q.push(Q('ps93-12','problem','12','Multiplying rational expressions','choice','Select the simplified form of '+math(frac('xy','x<sup>2</sup>+2xy+y<sup>2</sup>')+' · '+frac('ax+ay','ax<sup>2</sup>y'))+'.',{
  page:457,
  choices:makeChoices([frac('1','x<sup>2</sup>+xy'),frac('1','xy+y<sup>2</sup>'),frac('1','x<sup>2</sup>+y'),frac('xy+ax+ay','x<sup>2</sup>+2xy+y<sup>2</sup>+ax<sup>2</sup>y'),frac('x','x+y')]),
  correct:0,
  answerHTML:frac('1','x<sup>2</sup>+xy'),answerText:'1/(x^2+xy)',lesson:'factor-patterns',
  guide:['Factor both binomials that can be factored.','Cancel common factors before multiplying.'],
  hints:['x²+2xy+y²=(x+y)².','ax+ay=a(x+y).'],
  solution:[math(frac('xy','(x+y)<sup>2</sup>')+' · '+frac('a(x+y)','ax<sup>2</sup>y'))+'.','Cancel a, y, one x, and one factor x+y to get '+math(frac('1','x(x+y)'))+'='+math(frac('1','x<sup>2</sup>+xy'))+'.'],
  check:'This is choice A.'
 }));
 q.push(Q('ps93-13','problem','13','Subtracting rational expressions','choice','Select the simplified form of '+math(frac('3x+13b','x<sup>2</sup>+8bx+15b<sup>2</sup>')+' − '+frac('2','x+3b'))+'.',{
  page:458,
  choices:makeChoices([frac('x+18b','x<sup>2</sup>+8bx+15b<sup>2</sup>'),frac('3x+13b−2','x<sup>2</sup>+8bx+15b<sup>2</sup>'),frac('1','x+3b'),frac('1','x+5b'),frac('3b','x+3b')]),
  correct:3,
  answerHTML:frac('1','x+5b'),answerText:'1/(x+5b)',lesson:'factor-patterns',
  guide:['Factor the quadratic denominator.','Use the common denominator and simplify.'],
  hints:['x²+8bx+15b²=(x+3b)(x+5b).','Subtract 2(x+5b) from 3x+13b.'],
  solution:['The numerator becomes '+math('3x+13b−2x−10b=x+3b')+'.','Cancel the common factor '+math('x+3b')+' to get '+math(frac('1','x+5b'))+'.'],
  check:'This is choice D.'
 }));
 q.push(Q('ps93-14','problem','14','Polynomial division','choice','Select the simplified form of '+math(frac('2x<sup>3</sup>+2x<sup>2</sup>y−3xy<sup>2</sup>−y<sup>3</sup>','x−y'))+'.',{
  page:458,
  choices:makeChoices(['2x<sup>2</sup>+4xy+y<sup>2</sup>','2x<sup>2</sup>+2x<sup>2</sup>y−3xy<sup>2</sup>−y<sup>2</sup>','2x<sup>2</sup>−3y<sup>2</sup>','2xy−3y<sup>2</sup>','2x<sup>2</sup>−3xy+y<sup>2</sup>']),
  correct:0,
  answerHTML:'2x<sup>2</sup>+4xy+y<sup>2</sup>',answerText:'2x^2+4xy+y^2',lesson:'zero-remainder',
  guide:['Divide by x−y or verify by multiplication.'],
  hints:['Try quotient 2x²+4xy+y².'],
  solution:[math('(x−y)(2x<sup>2</sup>+4xy+y<sup>2</sup>)=2x<sup>3</sup>+2x<sup>2</sup>y−3xy<sup>2</sup>−y<sup>3</sup>')+'.'],
  check:'This is choice A.'
 }));
 q.push(Q('ps93-15','problem','15','Solving a linear equation','numeric','Solve '+math('17x+5=11x−13')+'.',{
  page:458,
  fields:[{key:'x',label:'x',placeholder:'number',value:-3,tolerance:1e-9}],
  answerHTML:'x=−3',answerText:'-3',lesson:'mixed-review',
  guide:['Collect x terms on one side and constants on the other.'],
  hints:['6x=−18.'],
  solution:[math('17x−11x=−13−5')+', so '+math('6x=−18')+' and '+math('x=−3')+'.']
 }));
 q.push(Q('ps93-16','problem','16','Square-root equation','numeric','Solve '+math(root('x−1')+'+3=x')+'. List only valid solutions.',{
  page:458,
  fields:[{key:'x',label:'x',placeholder:'number',value:5,tolerance:1e-9}],
  answerHTML:'x=5',answerText:'5',lesson:'mixed-review',
  guide:['Isolate the radical.','Square both sides.','Check all candidates in the original equation.'],
  hints:['√(x−1)=x−3, so x must be at least 3.','Squaring gives x−1=(x−3)².'],
  solution:['Square to get '+math('x−1=x<sup>2</sup>−6x+9')+'.','Rearrange: '+math('x<sup>2</sup>−7x+10=0=(x−5)(x−2)')+'.','The candidates are 5 and 2, but x=2 makes the isolated right side negative. Only '+math('x=5')+' satisfies the original equation.'],
  check:'√4+3=5.'
 }));
 q.push(Q('ps93-17','problem','17','Substitution into a formula','numeric','In '+math('u=3v<sup>2</sup>+2w')+', find '+math('u')+' when '+math('v=−8')+' and '+math('w=−24')+'.',{
  page:458,
  fields:[{key:'u',label:'u',placeholder:'number',value:144,tolerance:1e-9}],
  answerHTML:'u=144',answerText:'144',lesson:'mixed-review',
  guide:['Substitute the given values before simplifying.'],
  hints:['(−8)²=64.','3·64+2(−24)=192−48.'],
  solution:[math('u=3(64)−48=192−48=144')+'.']
 }));
 q.push(Q('ps93-18','problem','18','Solving for y','choice','Which choice represents '+math('2x+y=3y')+' after it has been solved for '+math('y')+'?',{
  page:458,
  choices:makeChoices(['y=x−2','y=2x','y=−x','y=x','y=3y+2x']),
  correct:3,
  answerHTML:'y=x',answerText:'y=x',lesson:'mixed-review',
  guide:['Move the y terms together.','Divide by the coefficient of y.'],
  hints:['2x=2y.'],
  solution:[math('2x+y=3y')+' gives '+math('2x=2y')+', so '+math('y=x')+'.'],
  check:'This is choice D.'
 }));
 q.push(Q('ps93-19','problem','19','Equation of line A','choice','Using the labeled graph, select the equation for line A.',{
  page:458,asset:'linesAB',
  choices:makeChoices([
   'y+2=−'+frac('1','2')+'(x+4)',
   'y+4=−'+frac('1','3')+'(x+2)',
   'y−2=−'+frac('1','4')+'(x−3)',
   'y−3=−'+frac('3','2')+'(x−2)',
   'y−2=−'+frac('1','2')+'(x−4)'
  ]),
  correct:4,
  answerHTML:'y−2=−'+frac('1','2')+'(x−4)',answerText:'y-2=-(1/2)(x-4)',lesson:'mixed-review',
  guide:['Use points (2,3) and (4,2).','Compute the slope, then use point-slope form.'],
  hints:['Slope=(2−3)/(4−2)=−1/2.','Using (4,2): y−2=−1/2(x−4).'],
  solution:['The slope of line A is '+math('−'+frac('1','2'))+'.','Using '+math('(4,2)')+' gives '+math('y−2=−'+frac('1','2')+'(x−4)')+'.'],
  check:'This is choice E.'
 }));
 q.push(Q('ps93-20','problem','20','Equation of line B','choice','Using the labeled graph, select the equation for line B.',{
  page:458,asset:'linesAB',
  choices:makeChoices([
   'y+0=4(x−4)',
   'y+3=3(x+5)',
   'y+5=3(x+3)',
   'y+3=6(x+5)',
   'y=2x−4'
  ]),
  correct:1,
  answerHTML:'y+3=3(x+5)',answerText:'y+3=3(x+5)',lesson:'mixed-review',
  guide:['Use points (−5,−3) and (−4,0).','Compute the slope, then use either point.'],
  hints:['Slope=(0−(−3))/(−4−(−5))=3.','Using (−5,−3): y+3=3(x+5).'],
  solution:['Line B has slope '+math('3')+'.','Point-slope form through '+math('(−5,−3)')+' is '+math('y+3=3(x+5)')+'.'],
  check:'This is choice B.'
 }));
 q.push(Q('ps93-21','problem','21','Triangle-angle application','numeric','The second angle of a triangle is 30° larger than the first, and the third angle is 3 times the second. How big is the first angle?',{
  page:458,
  fields:[{key:'angle',label:'First angle',suffix:'degrees',placeholder:'number',value:12,tolerance:1e-9}],
  answerHTML:'12°',answerText:'12',lesson:'mixed-review',
  guide:['Let x be the first angle.','Write the second and third angles in terms of x.','Use the triangle sum 180°.'],
  hints:['Second: x+30.','Third: 3(x+30).','x+(x+30)+3(x+30)=180.'],
  solution:[math('x+x+30+3x+90=180')+'.',math('5x+120=180')+', so '+math('x=12')+'.'],
  check:'The angles are 12°, 42°, and 126°, totaling 180°.'
 }));

 return q;
}

function graphLinesAB(){
 const W=560,H=390,X=x=>280+42*x,Y=y=>210-42*y;
 let grid='';
 for(let i=-6;i<=7;i++){
  grid+=`<line x1="${X(i)}" y1="35" x2="${X(i)}" y2="350" stroke="#ecece4"/>`;
  if(i>=-4&&i<=6)grid+=`<line x1="45" y1="${Y(i)}" x2="520" y2="${Y(i)}" stroke="#ecece4"/>`;
 }
 return `<figure class="graph-frame"><svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="l93g-title l93g-desc">
 <title id="l93g-title">Lines A and B with labeled points</title>
 <desc id="l93g-desc">Line A passes through (2,3) and (4,2). Line B passes through (-5,-3) and (-4,0).</desc>
 ${grid}
 <line x1="40" y1="${Y(0)}" x2="525" y2="${Y(0)}" stroke="#263b40" stroke-width="2.5"/>
 <line x1="${X(0)}" y1="25" x2="${X(0)}" y2="355" stroke="#263b40" stroke-width="2.5"/>
 <line x1="${X(-6)}" y1="${Y(7)}" x2="${X(7)}" y2="${Y(.5)}" stroke="#17685f" stroke-width="4"/>
 <line x1="${X(-6)}" y1="${Y(-6)}" x2="${X(-2)}" y2="${Y(6)}" stroke="#6d6155" stroke-width="4"/>
 <circle cx="${X(2)}" cy="${Y(3)}" r="6" fill="#17685f"/><circle cx="${X(4)}" cy="${Y(2)}" r="6" fill="#17685f"/>
 <circle cx="${X(-4)}" cy="${Y(0)}" r="6" fill="#6d6155"/><circle cx="${X(-5)}" cy="${Y(-3)}" r="6" fill="#6d6155"/>
 <g font-family="system-ui,sans-serif" font-size="16" fill="#182c35" style="paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round">
  <text x="${X(2)+8}" y="${Y(3)-8}">(2,3)</text><text x="${X(4)+8}" y="${Y(2)-8}">(4,2)</text>
  <text x="${X(-4)-72}" y="${Y(0)-12}">(−4,0)</text><text x="${X(-5)-62}" y="${Y(-3)+24}">(−5,−3)</text>
  <text x="${X(-5.5)}" y="${Y(5.6)}" fill="#17685f" font-weight="700">A</text>
  <text x="${X(-3.6)}" y="${Y(5.7)}" fill="#6d6155" font-weight="700">B</text>
 </g></svg><figcaption>Native redraw from the source coordinates. Use the labeled points rather than visual estimation.</figcaption></figure>`;
}

function renderQuestionAsset(q){return q.asset==='linesAB'?graphLinesAB():'';}

function referenceHtml(){return `<p>Use this sheet while you work. It summarizes Lesson 93 methods without giving the exercise answers.</p><div class="reference-grid">
 <div class="reference-item"><h4>Polynomial division cycle</h4><p>Divide leading terms → multiply the divisor → subtract → bring down → repeat.</p></div>
 <div class="reference-item"><h4>Ordering terms</h4><p>Order by descending powers of the first variable in the divisor. Insert zero-coefficient placeholders for missing powers.</p></div>
 <div class="reference-item"><h4>Zero remainder</h4><p>A remainder of 0 means the divisor is an exact factor of the dividend and can reduce the rational expression.</p></div>
 <div class="reference-item"><h4>Difference of squares</h4>${math('A<sup>2</sup>−B<sup>2</sup>=(A+B)(A−B)')}</div>
 <div class="reference-item"><h4>Perfect-square trinomial</h4>${math('A<sup>2</sup>+2AB+B<sup>2</sup>=(A+B)<sup>2</sup>')}</div>
 <div class="reference-item"><h4>Distance</h4>${math('d='+root('(Δx)<sup>2</sup>+(Δy)<sup>2</sup>'))}</div>
 <div class="reference-item"><h4>Horizontal line</h4><p>${math('y=c')} has slope 0.</p></div>
 <div class="reference-item"><h4>Hyperbola</h4>${math(frac('x<sup>2</sup>','a<sup>2</sup>')+'−'+frac('y<sup>2</sup>','b<sup>2</sup>')+'=1')}<p>Center at the origin in this form; vertices (±a,0); opens left/right.</p></div>
 <div class="reference-item"><h4>Line from two points</h4>${math('m='+frac('y<sub>2</sub>−y<sub>1</sub>','x<sub>2</sub>−x<sub>1</sub>'))}</div>
 </div>`;}

function freshCustomState(){return{};}
function normalizeCustomState(){return{};}
function mountTopicExtras(){}
function handleAction(){return false;}
function handleInput(){return false;}

const packageDef={
 id:'lesson-093',
 number:93,
 chapter:'Chapter 12',
 title:'Polynomial Division with Several Variables',
 contentVersion:'course-package-1.0',
 sourceRevision:'lesson93-2026-10-08-photos',
 heroTitle:'Divide. Multiply.<br><em>Subtract. Bring down.</em>',
 description:'Use polynomial long division with several variables to test factors, reduce rational expressions, and complete Practice 93 and Problem Set 93.',
 heroArt:`<div class="art-caption"><span>Polynomial long division</span><span>Zero remainder</span></div><div class="formula">${frac('2x<sup>3</sup>−x<sup>2</sup>y−2xy<sup>2</sup>+y<sup>3</sup>','x+y')}</div><div class="connector">↓</div><div class="formula">2x<sup>2</sup>−3xy+y<sup>2</sup></div><p class="art-foot">A zero remainder reveals an exact factor and a reducible fraction.</p>`,
 topics,
 sections:[
  {id:'practice',label:'Practice 93',intro:'Five exercises on factoring, conjugates, rational-expression simplification, polynomial division, and a triangle-angle application.'},
  {id:'problem',label:'Problem Set 93',intro:'Twenty-one review exercises covering scientific notation, geometry, factoring, rational expressions, polynomial division, equations, formulas, line equations, and applications.'}
 ],
 buildQuestions,
 referenceHtml,
 freshCustomState,
 normalizeCustomState,
 mountTopicExtras,
 handleAction,
 handleInput,
 renderQuestionAsset,
 sourceStatus:{pages:'454–458',verified:'2026-10-08 lesson photographs',uncertainItems:[]}
};
global.Algebra2CourseRegistry.register(packageDef);
})(window);
