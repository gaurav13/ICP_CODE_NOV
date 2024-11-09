import { Col, Table } from "react-bootstrap";

function Transection({ item }: { item: any }) {
  return (
    <>
      <tr>
        <td>{item.userName}</td>
        <td>{item.date} </td>
        <td>{item.admin} Tokens</td>
        <td>{item.platform} Tokens</td>
        <td>{item.gasFee} Tokens</td>
        <td>{item.promotional} Tokens</td>
        <td>
          { item.gasFee + item.promotional+item.platform+item.admin} Tokens
        </td>
      </tr>
    </>
  );
}
export default function TransectionItems({ currentItems }: { currentItems: any }) {
  return (
    <Col xl='12' lg='12'>
      <div className='full-div'>
        <div className='table-container lg'>
          <div className='table-inner-container'>
            <Table striped hover className='article-table'>
              <thead>
                <tr>
                  <th>
                    <p>
                      {/* {t('title')} */}
                      User
                     
                    </p>
                  </th>

                  <th>Date</th>
                  <th>Admin fee</th>
                  <th>Plateform fee</th>
                  <th>Gass fee</th>

                  <th>Promotional Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((entry: any, index: number) => {
                  return <Transection item={entry} key={index} />;
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Col>
  );
}
