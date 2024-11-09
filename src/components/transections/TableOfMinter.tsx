import { LANG } from "@/constant/language";
import useLocalization from "@/lib/UseLocalization";
import { Col, Table } from "react-bootstrap";
import Link from 'next/link';
import { USERPROFILELINK } from "@/constant/routes";
import { toast } from "react-toastify";

export default function TableItemOfMinter({ currentItems,isBurningList }: { currentItems: any,isBurningList?:boolean }) {
  const { t, changeLocale } = useLocalization(LANG);
  const copyPrincipal = (id:string) => {
    window.navigator.clipboard.writeText(id);
    toast.success(t('Address copied to clipboard'), { autoClose: 1000 });
  };
  return (
    <Col xl='12' lg='12'>
      <div className='full-div'>
        <div className='table-container lg'>
          <div className='table-inner-container'>
            <Table striped hover className='article-table transTable'>
              <thead>
                <tr>
                  <th>
                    <p>User</p>
                  </th>

                  <th>
                    {' '}
                    <p>Minting Amount </p>
                  </th>

                 {!isBurningList && <th>
                    {' '}
                    <p>Wallet </p>
                  </th>}
                  <th className=''>
                    {' '}
                    <p>Date </p>
                  </th>
                  <th className=''>
                    {' '}
                    <p>Time </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((item: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td>
                        <Link
                          href={USERPROFILELINK + item?.user}
                          target='_blank'
                          className='myUserLink'
                        >
                          {item?.name.slice(0, 75)}
                          {item?.name.length > 75 && '...'}{' '}
                        </Link>
                      </td>

                      <td>{item?.tokens}</td>
                     {!isBurningList &&  <td>{item?.wallet?.slice(0,10)}...{item?.wallet?.slice(-10)}   <i
                          onClick={()=>copyPrincipal(item?.wallet)}
                          className='fa fa-lg fa-copy '
                          style={{
                            cursor: 'pointer',
                            fontSize: 15,
                            color: 'black',
                          }}
                        /></td>}

                      <td>{item?.date}</td>
                      <td>{item?.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Col>
  );
}