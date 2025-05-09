import React from 'react';
import { Invitee } from '../api/getInvitees';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Props {
  invitees: Invitee[];
}

const InviteeList: React.FC<Props> = ({ invitees }) => {
  if (!invitees.length) {
    return (
      <Typography color="textSecondary" className="mt-8 text-center">
        紹介者はまだいません。
      </Typography>
    );
  }
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-lg">
      <CardContent>
        <Typography variant="h6" className="mb-4 text-pink-500 font-semibold">
          紹介者キャスト一覧
        </Typography>
        <TableContainer component={Paper} className="rounded-lg">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">獲得P</TableCell>
                <TableCell align="center">登録日</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invitees.map((invitee, idx) => (
                <TableRow key={idx} className="hover:bg-pink-50 transition">
                  <TableCell align="center">{invitee.display_number}</TableCell>
                  <TableCell align="center">{invitee.total_earned_point === 0 ? '仮登録済' : invitee.total_earned_point}</TableCell>
                  <TableCell align="center">{invitee.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default InviteeList;
