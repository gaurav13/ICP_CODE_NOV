import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { useEffect, useState } from 'react';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import logger from '@/lib/logger';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname } from 'next/navigation'
const ServayQustionReportchart = ({report}:{report:any}) => {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let questionId = searchParams.get('questionId');
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );
const [data, setdata] = useState({
  labels: ['Red', 'Blue', 'Yellow', 'Green', ],
  datasets: [
    {
      axis: 'y',
      label: `Report of ${questionId}`,
      data: [65, 59, 800, 81,],
      fill: false,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)'
        
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)'
     
      ],
      borderWidth: 1,
    },
  ],
})
  useEffect(() => {
if(report){
  logger(report,"dsjhfgjdsagfahgsdf")
  let questionName=report[1];
  let result=report[2];
  let templabes:string[]=[];
  let tempVals:number[]=[];
  result.forEach((e:any) => {
    let title=e.title;
    let val=parseInt(e.count);
    templabes.push(title);
    tempVals.push(val);
  });

  setdata({
    labels: templabes,
    datasets: [
      {
        axis: 'y',
        label: `Report of ${questionName}`,
        data: tempVals,
        fill: false,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
          
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)'
       
        ],
        borderWidth: 1,
      },
    ],
  })



}
  }, [report])

  const location = usePathname();
  let language;
 
  const changeLang = () => {
    if (LANG === 'jp') {
      if(location){
      language = location.includes('super-admin/') ?'en' : 'jp';
      }
    }
    else{
      language = "en"
    }
  };
  const funcCalling = changeLang()
  const { t, changeLocale } = useLocalization(language);
  

  return (
    <div>
      {report && <h2>{t('Report of')} {report[1]}</h2>}
      <Bar data={data} options={{ indexAxis: 'y' }} />
    </div>
  );
};

export default ServayQustionReportchart;
