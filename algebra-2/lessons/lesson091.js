(function(global){
'use strict';
const E = global.Algebra2Engine;
if(!E) throw Error('Algebra2Engine must load before Lesson 91.');
const {esc,math,frac,root,panel,callout,choice,makeChoices} = E.helpers;
const Q = (id,section,label,skill,type,prompt,rest) => ({id,section,label,skill,type,prompt,...rest});

const topics = [
{
 id:'reduce',
 title:'Factor before you cancel',
 short:'Reducing rational expressions',
 intro:'Multivariable rational expressions simplify the same way as ordinary algebraic fractions: factor completely, then cancel common factors.',
 body:
  `<p>The source lesson begins with a fraction containing both <em>a</em> and <em>x</em>:</p>${panel(frac('ax<sup>2</sup> − 5ax','3ax<sup>2</sup> + 6ax<sup>3</sup>'))}<p>Factoring is the key. The numerator has a common factor of ${math('ax')}; the denominator has a common factor of ${math('3ax<sup>2</sup>')}.</p>`,
 steps:[
  ['Factor the numerator.', math('ax<sup>2</sup> − 5ax = ax(x−5)')+'.'],
  ['Factor the denominator.', math('3ax<sup>2</sup> + 6ax<sup>3</sup> = 3ax<sup>2</sup>(1+2x)')+'.'],
  ['Cancel common factors, not terms.', 'Cancel the common '+math('a')+' and one '+math('x')+' factor to obtain '+math(frac('x−5','3x(1+2x)'))+'.']
 ],
 after:`${panel(frac('x−5','3x+6x<sup>2</sup>'),'The source expands the denominator again for its final fully simplified form.')}${callout('Cancellation requires factors','You may cancel a common factor that multiplies the entire numerator and denominator. You may not cancel pieces across addition or subtraction unless you factor first.')}`,
 mini:{prompt:'Before canceling in '+math(frac('6x(x−2)','3x(x+5)'))+', which factor is common to the entire numerator and denominator?',options:['x','x−2','x+5'],correct:0,explain:'x multiplies the entire numerator and denominator, so it can cancel where the original expression is defined.'}
},
{
 id:'grouping',
 title:'Factor by grouping when four terms cooperate',
 short:'Reducing by grouping',
 intro:'When a numerator has four terms, grouping can expose a repeated binomial factor.',
 body:
  `<p>The lesson uses this five-variable example:</p>${panel(frac('ars − art + bs − bt','r<sup>2</sup>s − r<sup>2</sup>t'))}<p>The denominator factors immediately as ${math('r<sup>2</sup>(s−t)')}. In the numerator, group the first two terms and the last two terms.</p>`,
 steps:[
  ['Group the numerator.', math('(ars−art) + (bs−bt)')+'.'],
  ['Factor each group.', math('ar(s−t) + b(s−t)')+'.'],
  ['Factor the repeated binomial.', math('(s−t)(ar+b)')+'.'],
  ['Cancel the common binomial.', math(frac('(s−t)(ar+b)','r<sup>2</sup>(s−t)')+' = '+frac('ar+b','r<sup>2</sup>'))+'.']
 ],
 after:callout('The pattern to notice','Factoring by grouping works here because both grouped pieces leave the same factor, '+math('(s−t)')+'.'),
 mini:{prompt:'Factor '+math('ax−ay+bx−by')+' by grouping.',options:['(x−y)(a+b)','(x+y)(a−b)','ab(x−y)'],correct:0,explain:'Group a(x−y)+b(x−y), then factor out the repeated binomial.'}
},
{
 id:'multiply',
 title:'Multiply rational expressions after factoring',
 short:'Multiplying multivariable fractions',
 intro:'Factor each numerator and denominator, cancel common factors, then multiply what remains.',
 body:
  `<p>The lesson multiplies:</p>${panel(frac('x<sup>2</sup>−2xy+y<sup>2</sup>','2x−6y')+' · '+frac('3x<sup>2</sup>−9xy','x<sup>2</sup>−y<sup>2</sup>'))}<p>Each piece can be factored: a perfect-square trinomial, common factors, and a difference of two squares.</p>`,
 steps:[
  ['Factor each expression.', math(frac('(x−y)(x−y)','2(x−3y)')+' · '+frac('3x(x−3y)','(x+y)(x−y)'))+'.'],
  ['Cancel repeated factors.', 'Cancel one '+math('(x−y)')+' and one '+math('(x−3y)')+'.'],
  ['Multiply what remains.', math(frac('3x(x−y)','2(x+y)'))+'.'],
  ['Distribute if the requested final form calls for it.', math(frac('3x<sup>2</sup>−3xy','2x+2y'))+'.']
 ],
 after:callout('Factor first','The cancellation becomes obvious only after every reducible polynomial has been factored.'),
 mini:{prompt:'What is the first useful rewrite of '+math('x<sup>2</sup>−y<sup>2</sup>')+'?',options:['(x+y)(x−y)','(x−y)<sup>2</sup>','x(x−y)'],correct:0,explain:'A difference of two squares factors as (x+y)(x−y).'}
},
{
 id:'divide',
 title:'Simplify complex fractions before inverting',
 short:'Dividing multivariable fractions',
 intro:'A complex fraction contains fractions inside its numerator or denominator. Simplify those pieces before using invert-and-multiply.',
 body:
  `<p>The source lesson demonstrates a large quotient built from products of rational expressions. The crucial rule is to simplify the top and bottom separately first.</p>${panel('Simplify numerator → simplify denominator → invert denominator → multiply','Do not invert until the internal products have been reduced.')}`,
 steps:[
  ['Simplify the top product.', 'Cancel common factors inside '+math(frac('x<sup>2</sup>','y')+' · '+frac('y<sup>2</sup>','x'))+' to get '+math('xy')+'.'],
  ['Simplify the bottom product.', 'Reduce the denominator product to '+math(frac('x<sup>2</sup>','2'))+'.'],
  ['Invert and multiply.', math('xy · '+frac('2','x<sup>2</sup>'))+'.'],
  ['Cancel the remaining x.', math(frac('2y','x'))+'.']
 ],
 after:callout('Main lesson point','For complex fractions, simplify the numerator and denominator before inverting and multiplying.'),
 mini:{prompt:'When dividing by '+math(frac('x','2'))+', what factor do you multiply by?',options:[frac('2','x'),frac('x','2'),'2x'],correct:0,explain:'Dividing by a fraction means multiplying by its reciprocal.'}
},
{
 id:'review-factor',
 title:'Keep earlier factoring and exponent tools ready',
 short:'Factoring & powers review',
 intro:'Problem Set 91 mixes the rational-expression lesson with earlier factoring, powers, and scientific-notation skills.',
 body:
  `${panel('a<sup>2</sup>−b<sup>2</sup>=(a+b)(a−b)<br>u<sup>2</sup>+2uv+v<sup>2</sup>=(u+v)<sup>2</sup><br>(x<sup>m</sup>)<sup>n</sup>=x<sup>mn</sup>')}<p>Several problems also ask you to combine like terms or write results in scientific notation.</p>`,
 steps:[
  ['Scientific notation multiplication.', 'Multiply the coefficients and add the powers of ten. Normalize the coefficient at the end.'],
  ['Scientific notation division.', 'Divide the coefficients and subtract the powers of ten.'],
  ['Power of a product.', 'Raise every factor inside parentheses to the outside power.']
 ],
 after:callout('Fully factor before reducing','A rational expression may require a greatest-common-factor step, a perfect-square pattern, or a difference-of-squares pattern before anything cancels.'),
 mini:{prompt:'Simplify '+math('(x<sup>5</sup>)<sup>3</sup>')+'.',options:['x<sup>8</sup>','x<sup>15</sup>','x<sup>125</sup>'],correct:1,explain:'For a power of a power, multiply the exponents: 5·3 = 15.'}
},
{
 id:'geometry-equations',
 title:'Coordinate geometry and equations remain part of the review',
 short:'Geometry & equation review',
 intro:'The problem set revisits distance, vertical lines, parabolas, linear equations, quadratics, and formula substitution.',
 body:
  `${panel('d='+root('(x<sub>2</sub>−x<sub>1</sub>)<sup>2</sup>+(y<sub>2</sub>−y<sub>1</sub>)<sup>2</sup>')+'<br>y−k=a(x−h)<sup>2</sup>','A parabola in vertex form has vertex (h,k); the sign of a tells whether it opens up or down.')}<p>A linear equation such as ${math('x+0y=−2')} reduces to ${math('x=−2')}, a vertical line.</p>`,
 steps:[
  ['Distance', 'Find horizontal and vertical changes, square them, add, then take the nonnegative square root.'],
  ['Parabola vertex', 'Read '+math('(h,k)')+' directly from '+math('y−k=a(x−h)<sup>2</sup>')+'.'],
  ['Solve equations', 'Clear fractions when helpful; factor quadratics and use the zero-product property.']
 ],
 after:callout('Check every solution','When a problem asks for every solution, list all values that satisfy the original equation.'),
 mini:{prompt:'The parabola '+math('y−3=2(x−8)<sup>2</sup>')+' has which vertex?',options:['(8,3)','(−8,3)','(8,−3)'],correct:0,explain:'Vertex form is y−k=a(x−h)², so h=8 and k=3.'}
},
{
 id:'lines-applications',
 title:'Read lines and translate perimeter problems',
 short:'Lines & applications',
 intro:'The final review items use slope, line equations, formula rearrangement, and rectangle perimeter relationships.',
 body:
  `${panel('m='+frac('y<sub>2</sub>−y<sub>1</sub>','x<sub>2</sub>−x<sub>1</sub>')+'<br>y−y<sub>1</sub>=m(x−x<sub>1</sub>)<br>P=2L+2W')}<p>For rectangle word problems, define the width, express the length in terms of that width, then substitute into the perimeter formula.</p>`,
 steps:[
  ['Line A', 'Using '+math('(0,2)')+' and '+math('(1,6)')+', the slope is 4, giving '+math('y=4x+2')+'.'],
  ['Line B', 'Using '+math('(−5,1)')+' and '+math('(2,−2)')+', the slope is '+math('−'+frac('3','7'))+'.'],
  ['Perimeter applications', 'Write both long sides and both widths in the equation before solving.']
 ],
 after:callout('Translate before solving','A phrase such as “60 feet longer than 2.5 times its width” means '+math('L=2.5W+60')+'.'),
 mini:{prompt:'If '+math('L=1.5W+20')+' and '+math('P=2L+2W')+', what equation represents a perimeter of 290?',options:['2W+2(1.5W+20)=290','W+(1.5W+20)=290','2W+1.5W+20=290'],correct:0,explain:'A rectangle has two widths and two lengths.'}
}
];

function buildQuestions(){
 const q=[];
 // Practice 91
 q.push(Q('p91-a','practice','a','Difference-of-squares factoring','choice','Select the factored form of '+math('16g<sup>2</sup>h<sup>2</sup> − 81k<sup>2</sup>p<sup>2</sup>')+'.',{
  page:445,choices:makeChoices(['(4g<sup>2</sup>h<sup>2</sup> + 9k<sup>2</sup>p<sup>2</sup>)(4g<sup>2</sup>h<sup>2</sup> − 9k<sup>2</sup>p<sup>2</sup>)','(4gh + 9kp)(4gh − 9kp)','(4gh + 9kp)<sup>2</sup>','(8gh + 40.5kp)(8gh − 40.5kp)','(4gh − 9kp)<sup>2</sup>']),correct:1,
  answerHTML:'(4gh + 9kp)(4gh − 9kp)',answerText:'(4gh + 9kp)(4gh - 9kp)',lesson:'review-factor',guide:['Rewrite each term as a square.','Use A²−B²=(A+B)(A−B).'],hints:['16g²h²=(4gh)².','81k²p²=(9kp)².'],solution:['Rewrite as '+math('(4gh)<sup>2</sup>−(9kp)<sup>2</sup>')+'.','Factor to get '+math('(4gh+9kp)(4gh−9kp)')+'.'],check:'The middle products cancel when expanded.'
 }));
 q.push(Q('p91-b','practice','b','Reducing a rational expression','choice','Select the simplified form of '+math(frac('cx<sup>2</sup> − 7cx','6dx<sup>3</sup> − 42dx<sup>2</sup>'))+'.',{
  page:445,choices:makeChoices([frac('c','6dx'),frac('c−7','6dx'),frac('1','6d'),frac('c','6d'),frac('−7','6dx')]),correct:0,
  answerHTML:frac('c','6dx'),answerText:'c/(6dx)',lesson:'reduce',guide:['Factor the numerator.','Factor the denominator.','Cancel the shared binomial and one power of x.'],hints:['Numerator: cx(x−7).','Denominator: 6dx²(x−7).'],solution:[''+math('cx<sup>2</sup>−7cx = cx(x−7)')+'.',''+math('6dx<sup>3</sup>−42dx<sup>2</sup> = 6dx<sup>2</sup>(x−7)')+'.','Cancel '+math('(x−7)')+' and one x to obtain '+math(frac('c','6dx'))+'.'],check:'The simplification is valid where the original denominator is nonzero.'
 }));
 q.push(Q('p91-c','practice','c','Multiplying and reducing rational expressions','choice','Select the simplified form of '+math(frac('y<sup>2</sup>−cy','a<sup>2</sup>−b<sup>2</sup>')+' · '+frac('a<sup>2</sup>+2ab+b<sup>2</sup>','by−bc'))+'.',{
  page:445,choices:makeChoices([frac('ay+by','a−b'),frac('a+b','a−b'),frac('c','b'),frac('ay+by','ab−b<sup>2</sup>'),frac('ay+b','ab−b')]),correct:3,
  answerHTML:frac('ay+by','ab−b<sup>2</sup>'),answerText:'(ay+by)/(ab-b^2)',lesson:'multiply',guide:['Factor every numerator and denominator.','Cancel repeated factors.','Multiply what remains.'],hints:['y²−cy=y(y−c).','a²−b²=(a−b)(a+b).','a²+2ab+b²=(a+b)² and by−bc=b(y−c).'],solution:['Factor to get '+math(frac('y(y−c)','(a−b)(a+b)')+' · '+frac('(a+b)<sup>2</sup>','b(y−c)'))+'.','Cancel '+math('(y−c)')+' and one '+math('(a+b)')+'.','The result is '+math(frac('y(a+b)','b(a−b)'))+', equivalent to '+math(frac('ay+by','ab−b<sup>2</sup>'))+'.'],check:'Expanding the final numerator and denominator matches choice D.'
 }));
 q.push(Q('p91-d','practice','d','Dividing a complex rational expression','choice','Select the simplified form of the complex fraction shown below.'+panel(frac(frac('x','y<sup>2</sup>')+' · '+frac('y','7x<sup>3</sup>'),frac('9xy','y<sup>4</sup>')+' · '+frac('y<sup>3</sup>','x<sup>2</sup>'))),{
  page:445,choices:makeChoices([frac('1','63xy'),frac('1','16xy'),frac('x<sup>2</sup>','63y<sup>4</sup>'),frac('1','63x<sup>4</sup>y'),frac('9','7x<sup>3</sup>y')]),correct:0,
  answerHTML:frac('1','63xy'),answerText:'1/(63xy)',lesson:'divide',guide:['Simplify the product in the numerator.','Simplify the product in the denominator.','Invert the simplified denominator and multiply.'],hints:['The top simplifies to 1/(7x²y).','The bottom simplifies to 9/x.','Now multiply by x/9.'],solution:['Top: '+math(frac('x','y<sup>2</sup>')+'·'+frac('y','7x<sup>3</sup>')+' = '+frac('1','7x<sup>2</sup>y'))+'.','Bottom: '+math(frac('9xy','y<sup>4</sup>')+'·'+frac('y<sup>3</sup>','x<sup>2</sup>')+' = '+frac('9','x'))+'.','Divide by '+math(frac('9','x'))+' by multiplying by '+math(frac('x','9'))+', giving '+math(frac('1','63xy'))+'.'],check:'No common factor remains.'
 }));
 q.push(Q('p91-e','practice','e','Rectangle perimeter word problem','numeric','Mr. Childers’s rectangular garden is 20 feet longer than 1.5 times its width, and the perimeter is 290 feet. What is the garden’s width?',{
  page:445,fields:[{key:'width',label:'Garden width',suffix:'feet',placeholder:'number',value:50,tolerance:1e-9}],answerHTML:'50 feet',answerText:'50',lesson:'lines-applications',guide:['Let w be the width.','Write the length as 1.5w+20.','Use P=2L+2W and solve.'],hints:['Use 2w + 2(1.5w+20)=290.','This simplifies to 5w+40=290.'],solution:['Let '+math('w')+' be the width, so '+math('L=1.5w+20')+'.','Perimeter: '+math('2w+2(1.5w+20)=290')+'.','Simplify: '+math('5w+40=290')+', so '+math('w=50')+'.'],check:'The length is 95 feet; 2(50)+2(95)=290.'
 }));

 // Problem Set 91
 q.push(Q('ps91-1','problem','1','Scientific notation multiplication','scientific','Simplify '+math('(5.2×10<sup>8</sup>)(4.9×10<sup>9</sup>)')+' and leave the answer in scientific notation.',{
  page:446,fields:[{key:'coefficient',label:'Coefficient',placeholder:'e.g., 2.548',value:2.548,tolerance:1e-12},{key:'exponent',label:'Exponent of 10',placeholder:'integer',value:18,tolerance:0}],answerHTML:'2.548×10<sup>18</sup>',answerText:'2.548×10^18',lesson:'review-factor',guide:['Multiply 5.2 by 4.9.','Add the exponents 8 and 9.','Normalize the coefficient to be between 1 and 10.'],hints:['5.2×4.9=25.48.','25.48×10^17 = 2.548×10^18.'],solution:[''+math('5.2·4.9=25.48')+'.',''+math('10<sup>8</sup>·10<sup>9</sup>=10<sup>17</sup>')+'.','Normalize: '+math('25.48×10<sup>17</sup>=2.548×10<sup>18</sup>')+'.'],check:'The coefficient 2.548 is in normalized scientific notation.'
 }));
 q.push(Q('ps91-2','problem','2','Scientific notation division','scientific','Simplify '+math(frac('7.77×10<sup>−6</sup>','3.7×10<sup>−11</sup>'))+' and leave the answer in scientific notation.',{
  page:446,fields:[{key:'coefficient',label:'Coefficient',placeholder:'e.g., 2.1',value:2.1,tolerance:1e-12},{key:'exponent',label:'Exponent of 10',placeholder:'integer',value:5,tolerance:0}],answerHTML:'2.1×10<sup>5</sup>',answerText:'2.1×10^5',lesson:'review-factor',guide:['Divide the coefficients.','Subtract the exponents.'],hints:['7.77÷3.7=2.1.','−6−(−11)=5.'],solution:[''+math('7.77÷3.7=2.1')+'.',''+math('10<sup>−6</sup>÷10<sup>−11</sup>=10<sup>5</sup>')+'.','So the answer is '+math('2.1×10<sup>5</sup>')+'.'],check:'The coefficient is already between 1 and 10.'
 }));
 q.push(Q('ps91-3','problem','3','Distance between two points','numeric','Find the distance between '+math('(3,−1)')+' and '+math('(6,3)')+' on the coordinate plane.',{
  page:446,fields:[{key:'distance',label:'Distance',suffix:'units',placeholder:'number',value:5,tolerance:1e-9}],answerHTML:'5 units',answerText:'5',lesson:'geometry-equations',guide:['Find Δx and Δy.','Use the distance formula.'],hints:['Δx=3 and Δy=4.','This forms a 3-4-5 right triangle.'],solution:[''+math('d='+root('(6−3)<sup>2</sup>+(3−(−1))<sup>2</sup>'))+'.',''+math('d='+root('9+16')+'='+root('25')+'=5')+'.'],check:'Distance is nonnegative.'
 }));
 q.push(Q('ps91-4','problem','4','Horizontal or vertical line','choice','Tell whether the line '+math('x+0y=−2')+' is horizontal or vertical.',{
  page:446,choices:[choice('H','Horizontal'),choice('V','Vertical')],correct:1,answerHTML:'Vertical',answerText:'Vertical',lesson:'geometry-equations',guide:['Simplify the equation.','Decide which coordinate is fixed.'],hints:['x+0y=−2 simplifies to x=−2.'],solution:['The equation is '+math('x=−2')+'.','Every point has the same x-coordinate, so the line is <strong>vertical</strong>.'],check:'Vertical lines have undefined slope.'
 }));
 q.push(Q('ps91-5','problem','5','Vertex form of a parabola','choice','For '+math('y−3=2(x−8)<sup>2</sup>')+', enter the vertex and tell whether the parabola opens up or down.',{
  page:446,choices:[choice('U','Opens up'),choice('D','Opens down')],correct:0,fields:[{key:'vx',label:'Vertex x',placeholder:'number',value:8,tolerance:1e-9},{key:'vy',label:'Vertex y',placeholder:'number',value:3,tolerance:1e-9}],answerHTML:'Vertex (8,3); opens up',answerText:'(8,3), opens up',lesson:'geometry-equations',guide:['Match to y−k=a(x−h)².','Read h and k.','Use the sign of a to determine direction.'],hints:['h=8 and k=3.','a=2 is positive.'],solution:['Vertex form gives '+math('(h,k)=(8,3)')+'.','Because '+math('a=2>0')+', the parabola opens <strong>up</strong>.'],check:'A positive leading coefficient makes a vertical parabola open upward.',answerHelp:'Enter both vertex coordinates and select the opening direction.'
 }));
 q.push(Q('ps91-6','problem','6','Factoring a greatest common factor','choice','Select the factored form of '+math('8xy<sup>3</sup>+56x<sup>2</sup>y')+'.',{
  page:446,choices:makeChoices(['8xy<sup>3</sup>(1+7y<sup>2</sup>)','8xy<sup>2</sup>(y+7x)','8xy(y<sup>2</sup>+48x)','56xy(7y<sup>2</sup>+8x)','8xy(y<sup>2</sup>+7x)']),correct:4,
  answerHTML:'8xy(y<sup>2</sup>+7x)',answerText:'8xy(y^2+7x)',lesson:'review-factor',guide:['Find the greatest common factor.','Divide each term by it.'],hints:['Both terms share 8xy.'],solution:['Factor out '+math('8xy')+': '+math('8xy<sup>3</sup>+56x<sup>2</sup>y = 8xy(y<sup>2</sup>+7x)')+'.'],check:'Distribute 8xy to recover both original terms.'
 }));
 q.push(Q('ps91-7','problem','7','Perfect-square trinomial factoring','choice','Select the factored form of '+math('y<sup>2</sup>+2yz+z<sup>2</sup>')+'.',{
  page:446,choices:makeChoices(['(y+z)<sup>2</sup>','(y+z)(y−z)','(y−z)<sup>2</sup>','(y<sup>2</sup>+z<sup>2</sup>)<sup>2</sup>','2(y+z)']),correct:0,
  answerHTML:'(y+z)<sup>2</sup>',answerText:'(y+z)^2',lesson:'review-factor',guide:['Recognize the square terms.','Check the middle term.'],hints:['2yz is twice the product of y and z.'],solution:['The trinomial matches '+math('u<sup>2</sup>+2uv+v<sup>2</sup>=(u+v)<sup>2</sup>')+'.','Therefore it factors as '+math('(y+z)<sup>2</sup>')+'.'],check:'Expanding (y+z)² gives the original expression.'
 }));
 q.push(Q('ps91-8','problem','8','Difference-of-squares factoring','choice','Select the factored form of '+math('9p<sup>2</sup>q<sup>2</sup>−100s<sup>2</sup>t<sup>2</sup>')+'.',{
  page:446,choices:makeChoices(['(4.5pq+50st)(4.5pq−50st)','(3pq+10st)<sup>2</sup>','(3p<sup>2</sup>q<sup>2</sup>+10s<sup>2</sup>t<sup>2</sup>)(3p<sup>2</sup>q<sup>2</sup>−10s<sup>2</sup>t<sup>2</sup>)','(3pq−10st)<sup>2</sup>','(3pq+10st)(3pq−10st)']),correct:4,
  answerHTML:'(3pq+10st)(3pq−10st)',answerText:'(3pq+10st)(3pq-10st)',lesson:'review-factor',guide:['Rewrite both terms as squares.','Apply the difference-of-squares pattern.'],hints:['9p²q²=(3pq)².','100s²t²=(10st)².'],solution:[''+math('9p<sup>2</sup>q<sup>2</sup>−100s<sup>2</sup>t<sup>2</sup>=(3pq)<sup>2</sup>−(10st)<sup>2</sup>')+'.','Factor as '+math('(3pq+10st)(3pq−10st)')+'.'],check:'The middle products cancel.'
 }));
 q.push(Q('ps91-9','problem','9','Reducing a rational expression','choice','Select the simplified form of '+math(frac('bx<sup>2</sup>−8bx','5ax<sup>3</sup>−40ax<sup>2</sup>'))+'.',{
  page:446,choices:makeChoices([frac('−8','5ax'),frac('b','5a'),frac('b','5ax'),frac('b−8','5ax'),frac('1','5a')]),correct:2,
  answerHTML:frac('b','5ax'),answerText:'b/(5ax)',lesson:'reduce',guide:['Factor numerator and denominator.','Cancel the common factor x−8 and one x.'],hints:['Numerator: bx(x−8).','Denominator: 5ax²(x−8).'],solution:[''+math('bx<sup>2</sup>−8bx=bx(x−8)')+'.',''+math('5ax<sup>3</sup>−40ax<sup>2</sup>=5ax<sup>2</sup>(x−8)')+'.','Cancel to get '+math(frac('b','5ax'))+'.'],check:'The original denominator must remain nonzero.'
 }));
 q.push(Q('ps91-10','problem','10','Reducing by factoring by grouping','choice','Select the simplified form of '+math(frac('abx−aby+cx−cy','2dx−2dy'))+'.',{
  page:446,choices:makeChoices([frac('a+b+c','2d'),frac('ab+c','x−y'),frac('abc','2d'),frac('ab+c','2d'),frac('a−bc','x−y')]),correct:3,
  answerHTML:frac('ab+c','2d'),answerText:'(ab+c)/(2d)',lesson:'grouping',guide:['Group the numerator terms.','Factor the denominator.','Cancel the common x−y factor.'],hints:['Numerator=(x−y)(ab+c).','Denominator=2d(x−y).'],solution:['Group: '+math('ab(x−y)+c(x−y)=(x−y)(ab+c)')+'.','Denominator: '+math('2d(x−y)')+'.','Cancel '+math('(x−y)')+' to obtain '+math(frac('ab+c','2d'))+'.'],check:'This matches choice D.'
 }));
 q.push(Q('ps91-11','problem','11','Power of a monomial','choice','Select the simplified form of '+math('('+frac('2','3')+'x<sup>5</sup>y<sup>4</sup>)<sup>3</sup>')+'.',{
  page:446,choices:makeChoices([frac('8','27')+'x<sup>125</sup>y<sup>54</sup>','2x<sup>8</sup>y<sup>7</sup>','2x<sup>15</sup>y<sup>12</sup>',frac('8','27')+'x<sup>8</sup>y<sup>7</sup>',frac('8','27')+'x<sup>15</sup>y<sup>12</sup>']),correct:4,
  answerHTML:frac('8','27')+'x<sup>15</sup>y<sup>12</sup>',answerText:'(8/27)x^15y^12',lesson:'review-factor',guide:['Cube the coefficient fraction.','Multiply each variable exponent by 3.'],hints:['(2/3)³=8/27.','5·3=15 and 4·3=12.'],solution:[''+math('('+frac('2','3')+')<sup>3</sup>='+frac('8','27'))+'.',''+math('(x<sup>5</sup>)<sup>3</sup>=x<sup>15</sup>')+' and '+math('(y<sup>4</sup>)<sup>3</sup>=y<sup>12</sup>')+'.'],check:'Every factor inside the parentheses receives the outside power.'
 }));
 q.push(Q('ps91-12','problem','12','Multiplying and reducing rational expressions','choice','Select the simplified form of '+math(frac('x<sup>2</sup>−ax','x<sup>2</sup>−y<sup>2</sup>')+' · '+frac('x<sup>2</sup>+2xy+y<sup>2</sup>','bx−ab'))+'.',{
  page:446,choices:makeChoices([frac('a','b'),frac('x<sup>2</sup>+xy','bx−by'),frac('x+y','x−y'),frac('x<sup>2</sup>+y','bx−y'),frac('x<sup>2</sup>+xy','x−y')]),correct:1,
  answerHTML:frac('x<sup>2</sup>+xy','bx−by'),answerText:'(x^2+xy)/(bx-by)',lesson:'multiply',guide:['Factor all four polynomial pieces.','Cancel common factors.','Multiply the remaining factors.'],hints:['x²−ax=x(x−a).','x²−y²=(x−y)(x+y).','x²+2xy+y²=(x+y)² and bx−ab=b(x−a).'],solution:['Factor to get '+math(frac('x(x−a)','(x−y)(x+y)')+' · '+frac('(x+y)<sup>2</sup>','b(x−a)'))+'.','Cancel '+math('(x−a)')+' and one '+math('(x+y)')+'.','Result: '+math(frac('x(x+y)','b(x−y)')+' = '+frac('x<sup>2</sup>+xy','bx−by'))+'.'],check:'This is choice B.'
 }));
 q.push(Q('ps91-13','problem','13','Combining like terms','choice','Select the simplified form of '+math(frac('3','7')+'xyz + '+frac('1','7')+'xyz')+'.',{
  page:447,choices:makeChoices([frac('2','7')+'xyz',frac('3','49')+'xyz',frac('4','7')+'x<sup>2</sup>y<sup>2</sup>z<sup>2</sup>',frac('4','7')+'xyz',frac('3','49')+'x<sup>2</sup>y<sup>2</sup>z<sup>2</sup>']),correct:3,
  answerHTML:frac('4','7')+'xyz',answerText:'(4/7)xyz',lesson:'review-factor',guide:['The variable parts match exactly.','Add the coefficients.'],hints:['3/7+1/7=4/7.'],solution:['Because both terms are like terms, add their coefficients: '+math(frac('3','7')+'+'+frac('1','7')+'='+frac('4','7'))+'.','The result is '+math(frac('4','7')+'xyz')+'.'],check:'The exponents on x, y, and z do not change when adding like terms.'
 }));
 q.push(Q('ps91-14','problem','14','Dividing a complex rational expression','choice','Select the simplified form of the complex fraction shown below.'+panel(frac(frac('r','t<sup>2</sup>')+' · '+frac('t','5r<sup>2</sup>'),frac('3rt','t<sup>3</sup>')+' · '+frac('t<sup>2</sup>','r<sup>2</sup>'))),{
  page:447,choices:makeChoices([frac('1','15t'),frac('5r','3t<sup>2</sup>'),frac('3','5t'),frac('1','8t'),frac('3','5r<sup>2</sup>t')]),correct:0,
  answerHTML:frac('1','15t'),answerText:'1/(15t)',lesson:'divide',guide:['Simplify the numerator product.','Simplify the denominator product.','Invert the simplified denominator and multiply.'],hints:['Top simplifies to 1/(5rt).','Bottom simplifies to 3/r.'],solution:['Top: '+math(frac('r','t<sup>2</sup>')+'·'+frac('t','5r<sup>2</sup>')+'='+frac('1','5rt'))+'.','Bottom: '+math(frac('3rt','t<sup>3</sup>')+'·'+frac('t<sup>2</sup>','r<sup>2</sup>')+'='+frac('3','r'))+'.','Divide by '+math(frac('3','r'))+' by multiplying by '+math(frac('r','3'))+', giving '+math(frac('1','15t'))+'.'],check:'This matches choice A.'
 }));
 q.push(Q('ps91-15','problem','15','Solving an equation with fractions','numeric','Solve '+math(frac('1','2')+'(x−6) = '+frac('1','3')+'(x+5)')+'.',{
  page:447,fields:[{key:'x',label:'x',placeholder:'number',value:28,tolerance:1e-9}],answerHTML:'x = 28',answerText:'28',lesson:'geometry-equations',guide:['Clear the fractions by multiplying by 6.','Solve the resulting linear equation.'],hints:['3(x−6)=2(x+5).','3x−18=2x+10.'],solution:['Multiply by 6: '+math('3(x−6)=2(x+5)')+'.','Expand: '+math('3x−18=2x+10')+'.','Therefore '+math('x=28')+'.'],check:'Both sides equal 11 when x=28.'
 }));
 q.push(Q('ps91-16','problem','16','Solving a quadratic equation','numeric','Solve '+math('x<sup>2</sup>+4x+3=0')+'. Give every solution from least to greatest.',{
  page:447,fields:[{key:'small',label:'Smaller solution',placeholder:'number',value:-3,tolerance:1e-9},{key:'large',label:'Larger solution',placeholder:'number',value:-1,tolerance:1e-9}],answerHTML:'x = −3 or x = −1',answerText:'-3, -1',lesson:'geometry-equations',guide:['Factor the quadratic.','Use the zero-product property.'],hints:['Find two numbers that multiply to 3 and add to 4.','(x+1)(x+3)=0.'],solution:['Factor: '+math('x<sup>2</sup>+4x+3=(x+1)(x+3)')+'.','Set each factor equal to zero: '+math('x=−1')+' or '+math('x=−3')+'.'],check:'Both values make the original quadratic zero.',answerHelp:'Enter the smaller solution first.'
 }));
 q.push(Q('ps91-17','problem','17','Substitution into a polynomial formula','numeric','In '+math('y=ax<sup>3</sup>+bx<sup>2</sup>+cx')+', find '+math('y')+' when '+math('a=2')+', '+math('b=−3')+', '+math('c=5')+', and '+math('x=−1')+'.',{
  page:447,fields:[{key:'y',label:'y',placeholder:'number',value:-10,tolerance:1e-9}],answerHTML:'y = −10',answerText:'-10',lesson:'geometry-equations',guide:['Substitute every given value carefully.','Apply exponents before multiplication.'],hints:['(−1)³=−1 and (−1)²=1.','Compute 2(−1)−3(1)+5(−1).'],solution:[''+math('y=2(−1)<sup>3</sup>+(−3)(−1)<sup>2</sup>+5(−1)')+'.','This is '+math('−2−3−5=−10')+'.'],check:'The final value is −10.'
 }));
 q.push(Q('ps91-18','problem','18','Solving a formula for a variable','choice','Which choice represents '+math('2s+t=uv')+' after it has been solved for '+math('s')+'?',{
  page:447,choices:makeChoices(['s = 2uv−2','s = uv−t−2','s = '+frac('uv+t','2'),'s = '+frac('uvt','2'),'s = '+frac('uv−t','2')]),correct:4,
  answerHTML:'s = '+frac('uv−t','2'),answerText:'s=(uv-t)/2',lesson:'lines-applications',guide:['Subtract t from both sides.','Divide by 2.'],hints:['2s=uv−t.'],solution:['Start with '+math('2s+t=uv')+'.','Subtract t: '+math('2s=uv−t')+'.','Divide by 2: '+math('s='+frac('uv−t','2'))+'.'],check:'Substitution recovers the original equation.'
 }));
 q.push(Q('ps91-19','problem','19','Equation of line A','choice','Select the equation for line A from the graph.',{
  page:447,asset:'lines',targetLine:'A',choices:makeChoices(['y−1=7(x−6)','y=7x+2','y=4x−2','y=4x+2','y+6=4(x+1)']),correct:3,
  answerHTML:'y = 4x + 2',answerText:'y=4x+2',lesson:'lines-applications',guide:['Use the labeled points (0,2) and (1,6).','Find the slope and intercept.'],hints:['Slope=(6−2)/(1−0)=4.','The point (0,2) gives y-intercept 2.'],solution:['The slope is '+math('4')+'.','Since the line crosses the y-axis at '+math('2')+', its equation is '+math('y=4x+2')+'.'],check:'At x=1, the equation gives y=6.',answerHelp:'Use the native graph above and select the matching equation.'
 }));
 q.push(Q('ps91-20','problem','20','Equation of line B','choice','Select the equation for line B from the graph.',{
  page:447,asset:'lines',targetLine:'B',choices:makeChoices(['y+2=−'+frac('1','3')+'(x−2)','y−1=−'+frac('3','7')+'(x+5)','y−1=−'+frac('2','7')+'(x+5)','y−2=−'+frac('3','7')+'(x+2)','y+1=−'+frac('3','7')+'(x−5)']),correct:1,
  answerHTML:'y−1 = −'+frac('3','7')+'(x+5)',answerText:'y-1=-(3/7)(x+5)',lesson:'lines-applications',guide:['Use the labeled points (−5,1) and (2,−2).','Find the slope.','Use point-slope form with either point.'],hints:['Slope=(−2−1)/(2−(−5))=−3/7.','Using (−5,1): y−1=−(3/7)(x+5).'],solution:['The slope is '+math('−'+frac('3','7'))+'.','Point-slope form through '+math('(−5,1)')+' is '+math('y−1=−'+frac('3','7')+'(x+5)')+'.'],check:'Substituting x=2 gives y=−2.',answerHelp:'Use the native graph above and select the matching equation.'
 }));
 q.push(Q('ps91-21','problem','21','Shopping-center perimeter word problem','numeric','A rectangular shopping center is 60 feet longer than 2.5 times its width. If the perimeter is 1,100 feet, what is the shopping center’s width?',{
  page:447,fields:[{key:'width',label:'Shopping center width',suffix:'feet',placeholder:'number',value:140,tolerance:1e-9}],answerHTML:'140 feet',answerText:'140',lesson:'lines-applications',guide:['Let w be the width.','Write L=2.5w+60.','Use 2L+2W=1100.'],hints:['Use 2w+2(2.5w+60)=1100.','This becomes 7w+120=1100.'],solution:['Let '+math('w')+' be the width. Then '+math('L=2.5w+60')+'.','Perimeter: '+math('2w+2(2.5w+60)=1100')+'.','Simplify: '+math('7w+120=1100')+', so '+math('7w=980')+' and '+math('w=140')+'.'],check:'The length is 410 feet; 2(140)+2(410)=1100.'
 }));
 return q;
}

function lineGraph(target){
 const W=600,H=420,s=30,ox=300,oy=210;const X=x=>ox+x*s,Y=y=>oy-y*s;
 let grid='';for(let i=-8;i<=8;i++){grid+=`<line x1="${X(i)}" y1="25" x2="${X(i)}" y2="395" stroke="#ecece4"/><line x1="55" y1="${Y(i)}" x2="545" y2="${Y(i)}" stroke="#ecece4"/>`;}
 const colorA=target==='A'?'#17685f':'#53615d',colorB=target==='B'?'#17685f':'#53615d';
 const line=(m,b,color)=>{const x1=-8,x2=8;return `<line x1="${X(x1)}" y1="${Y(m*x1+b)}" x2="${X(x2)}" y2="${Y(m*x2+b)}" stroke="${color}" stroke-width="4"/>`;};
 const pts=(arr,color)=>arr.map(([x,y,label])=>`<circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="${color}"/><text x="${X(x)+10}" y="${Y(y)-10}" font-size="17" font-family="system-ui">${label}</text>`).join('');
 return `<figure class="graph-frame" style="max-width:720px"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Coordinate graph with line A through (0,2) and (1,6), and line B through (−5,1) and (2,−2)">${grid}<line x1="45" y1="${oy}" x2="555" y2="${oy}" stroke="#263b40" stroke-width="2.5"/><line x1="${ox}" y1="15" x2="${ox}" y2="405" stroke="#263b40" stroke-width="2.5"/>${line(4,2,colorA)}${line(-3/7,-8/7,colorB)}${pts([[0,2,'(0, 2)'],[1,6,'(1, 6)']],colorA)}${pts([[-5,1,'(−5, 1)'],[2,-2,'(2, −2)']],colorB)}<text x="535" y="198" font-size="20">x</text><text x="310" y="28" font-size="20">y</text><text x="338" y="42" font-size="21" font-weight="700" fill="${colorA}">A</text><text x="78" y="85" font-size="21" font-weight="700" fill="${colorB}">B</text></svg><figcaption>Native app redraw from the source-labeled coordinates. ${target?`Line ${target} is emphasized.`:''}</figcaption></figure>`;
}
function renderQuestionAsset(q){return q.asset==='lines'?lineGraph(q.targetLine):'';}

function referenceHtml(){return `<p>Use this sheet while you work. It summarizes the Lesson 91 methods without giving the exercise answers.</p><div class="reference-grid">
 <div class="reference-item"><h4>Reduce a rational expression</h4><p>Factor numerator and denominator completely; cancel common <em>factors</em>; then multiply or expand only if the requested form requires it.</p></div>
 <div class="reference-item"><h4>Factoring by grouping</h4>${math('ax−ay+bx−by=(x−y)(a+b)')}<p>Group terms so the same binomial remains.</p></div>
 <div class="reference-item"><h4>Perfect-square trinomial</h4>${math('u<sup>2</sup>±2uv+v<sup>2</sup>=(u±v)<sup>2</sup>')}</div>
 <div class="reference-item"><h4>Difference of squares</h4>${math('u<sup>2</sup>−v<sup>2</sup>=(u+v)(u−v)')}</div>
 <div class="reference-item"><h4>Multiply rational expressions</h4><p>Factor first, cancel across the product, then multiply remaining numerators and denominators.</p></div>
 <div class="reference-item"><h4>Divide complex fractions</h4><p>Simplify top and bottom first; then invert the denominator and multiply.</p></div>
 <div class="reference-item"><h4>Scientific notation</h4><p>Multiply: add powers of ten. Divide: subtract powers. Normalize the coefficient to 1≤|a|&lt;10.</p></div>
 <div class="reference-item"><h4>Distance</h4>${math('d='+root('(Δx)<sup>2</sup>+(Δy)<sup>2</sup>'))}</div>
 <div class="reference-item"><h4>Parabola vertex form</h4>${math('y−k=a(x−h)<sup>2</sup>')}<p>Vertex (h,k); sign of a controls up/down.</p></div>
 <div class="reference-item"><h4>Point-slope form</h4>${math('y−y<sub>1</sub>=m(x−x<sub>1</sub>)')}</div>
 <div class="reference-item"><h4>Rectangle perimeter</h4>${math('P=2L+2W')}<p>Translate the length relationship first, then substitute.</p></div>
 </div>`;}

function freshCustomState(){return{};}
function normalizeCustomState(){return{};}
function mountTopicExtras(){}
function handleAction(){return false;}
function handleInput(){return false;}

const packageDef={
 id:'lesson-091',
 number:91,
 chapter:'Chapter 12',
 title:'Rational Expressions Revisited',
 contentVersion:'course-package-1.0',
 sourceRevision:'lesson91-2026-10-06-photos',
 heroTitle:'Factor first.<br><em>Cancel only what truly matches.</em>',
 description:'Reduce, multiply, and divide multivariable rational expressions, then apply the lesson alongside the mixed review skills in Practice 91 and Problem Set 91.',
 heroArt:`<div class="art-caption"><span>Factor</span><span>Cancel</span><span>Simplify</span></div><div class="formula">${frac('ax(x−5)','3ax<sup>2</sup>(1+2x)')}</div><div class="connector">↓</div><div class="formula">${frac('x−5','3x(1+2x)')}</div><p class="art-foot">Cancellation works on factors—not on pieces of sums or differences.</p>`,
 topics,
 sections:[
  {id:'practice',label:'Practice 91',intro:'Five exercises on factoring, reducing rational expressions, multiplying/dividing complex expressions, and a rectangle application.'},
  {id:'problem',label:'Problem Set 91',intro:'Twenty-one review exercises covering scientific notation, coordinate geometry, factoring, rational expressions, equations, formulas, lines, and perimeter applications.'}
 ],
 buildQuestions,
 referenceHtml,
 freshCustomState,
 normalizeCustomState,
 mountTopicExtras,
 handleAction,
 handleInput,
 renderQuestionAsset,
 sourceStatus:{pages:'443–447',verified:'2026-10-06 user-supplied photographs and close-ups',uncertainItems:[]}
};
global.Algebra2CourseRegistry.register(packageDef);
})(window);
